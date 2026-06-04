import Stripe from "stripe";
import { Booking, Room, Hotel, User } from "../models/index.js";
import { sendBookingConfirmationEmail } from "../config/nodemailer.js";

// Helper: check availability
const checkAvailability = async ({ room, checkInDate, checkOutDate }) => {
  const conflicting = await Booking.find({
    room,
    status: { $ne: "cancelled" },
    $or: [
      { checkIn: { $lt: new Date(checkOutDate) }, checkOut: { $gt: new Date(checkInDate) } },
    ],
  });
  return conflicting.length === 0;
};

// POST /api/bookings/check-availability
export const checkRoomAvailability = async (req, res, next) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    if (!room || !checkInDate || !checkOutDate) {
      return res.status(400).json({ success: false, message: "Room, check-in, and check-out dates are required." });
    }
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      return res.status(400).json({ success: false, message: "Check-out must be after check-in." });
    }
    const isAvailable = await checkAvailability({ room, checkInDate, checkOutDate });
    res.json({ success: true, isAvailable });
  } catch (error) {
    next(error);
  }
};

// POST /api/bookings/book
export const bookRoom = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { room, checkInDate, checkOutDate, persons, paymentMethod, specialRequests } = req.body;

    if (!room || !checkInDate || !checkOutDate || !persons) {
      return res.status(400).json({ success: false, message: "All booking fields are required." });
    }
    if (new Date(checkInDate) >= new Date(checkOutDate)) {
      return res.status(400).json({ success: false, message: "Check-out must be after check-in." });
    }
    if (new Date(checkInDate) < new Date()) {
      return res.status(400).json({ success: false, message: "Check-in date cannot be in the past." });
    }

    const isAvailable = await checkAvailability({ room, checkInDate, checkOutDate });
    if (!isAvailable) {
      return res.status(400).json({ success: false, message: "Room is not available for selected dates." });
    }

    const roomData = await Room.findById(room).populate("hotel");
    if (!roomData) return res.status(404).json({ success: false, message: "Room not found." });

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 3600 * 24));
    const totalPrice = roomData.pricePerNight * nights;

    const loyaltyPoints = Math.floor(totalPrice / 10);

    const booking = await Booking.create({
      user: id,
      room,
      hotel: roomData.hotel._id,
      checkIn,
      checkOut,
      persons: parseInt(persons),
      totalPrice,
      paymentMethod: paymentMethod || "Pay At Hotel",
      specialRequests: specialRequests || "",
      loyaltyPointsEarned: loyaltyPoints,
    });

    // Award loyalty points
    await User.findByIdAndUpdate(id, { $inc: { loyaltyPoints } });

    // Send email (non-blocking)
    const user = await User.findById(id);
    sendBookingConfirmationEmail({
      to: user.email,
      name: user.name,
      booking,
      room: roomData,
      hotel: roomData.hotel,
    });

    res.status(201).json({
      success: true,
      message: "Room booked successfully! Confirmation email sent.",
      booking,
      loyaltyPointsEarned: loyaltyPoints,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/bookings/user
export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("room hotel")
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

// GET /api/bookings/hotel (owner)
export const getHotelBookings = async (req, res, next) => {
  try {
    const hotels = await Hotel.find({ owner: req.user.id }).select("_id");
    if (!hotels.length) return res.json({ success: true, bookings: [] });

    const hotelIds = hotels.map((h) => h._id);
    const bookings = await Booking.find({ hotel: { $in: hotelIds } })
      .populate("room hotel user", "-password")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/bookings/:id/cancel
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }
    if (booking.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Booking already cancelled." });
    }

    booking.status = "cancelled";
    await booking.save();

    // Revoke loyalty points
    await User.findByIdAndUpdate(req.user.id, { $inc: { loyaltyPoints: -booking.loyaltyPointsEarned } });

    res.json({ success: true, message: "Booking cancelled successfully.", booking });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/bookings/:id/status (owner)
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!["confirmed", "pending", "cancelled"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status." });
    }
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate("room hotel user", "-password");
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });
    res.json({ success: true, message: "Booking status updated.", booking });
  } catch (error) {
    next(error);
  }
};

// POST /api/bookings/stripe-payment
export const stripePayment = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(503).json({ success: false, message: "Payment service not configured." });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found." });
    
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }

    const roomData = await Room.findById(booking.room).populate("hotel");
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const { origin } = req.headers;

    const session = await stripeInstance.checkout.sessions.create({
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: `${roomData.hotel.hotelName} — ${roomData.roomType}` },
          unit_amount: Math.round(booking.totalPrice * 100),
        },
        quantity: 1,
      }],
      mode: "payment",
      success_url: `${origin}/my-bookings?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/my-bookings?payment=cancel`,
      metadata: { bookingId },
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    next(error);
  }
};

// POST /api/bookings/stripe-webhook
export const stripeWebhook = async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret || !sig) {
    return res.status(400).json({ success: false, message: "Webhook secret not configured or missing signature." });
  }

  try {
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    // Get raw body for signature verification
    let rawBody = req.body;
    if (typeof rawBody === 'object') {
      rawBody = JSON.stringify(rawBody);
    }

    const event = stripeInstance.webhooks.constructEvent(rawBody, sig, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const bookingId = session.metadata?.bookingId;

      if (bookingId) {
        const booking = await Booking.findByIdAndUpdate(
          bookingId,
          { isPaid: true, status: "confirmed", paymentMethod: "Stripe" },
          { new: true }
        ).populate("user room hotel");

        if (booking) {
          // Send payment confirmation email
          try {
            sendBookingConfirmationEmail({
              to: booking.user.email,
              name: booking.user.name,
              booking,
              room: booking.room,
              hotel: booking.hotel,
              emailType: "payment",
            });
          } catch (emailErr) {
            console.error("Email sending failed:", emailErr);
          }
        }
      }
    }

    res.json({ success: true, received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// GET /api/bookings/dashboard (owner analytics)
export const getOwnerDashboard = async (req, res, next) => {
  try {
    const hotels = await Hotel.find({ owner: req.user.id }).select("_id hotelName");
    const hotelIds = hotels.map((h) => h._id);

    const [bookings, totalRooms] = await Promise.all([
      Booking.find({ hotel: { $in: hotelIds } }).populate("room hotel user", "-password"),
      Room.countDocuments({ hotel: { $in: hotelIds } }),
    ]);

    const totalRevenue = bookings.filter((b) => b.status !== "cancelled").reduce((s, b) => s + b.totalPrice, 0);
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const cancelled = bookings.filter((b) => b.status === "cancelled").length;

    // Monthly revenue (last 6 months)
    const monthlyRevenue = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleString("default", { month: "short", year: "2-digit" });
      monthlyRevenue[label] = 0;
    }
    bookings.forEach((b) => {
      if (b.status === "cancelled") return;
      const label = new Date(b.createdAt).toLocaleString("default", { month: "short", year: "2-digit" });
      if (monthlyRevenue[label] !== undefined) monthlyRevenue[label] += b.totalPrice;
    });

    // Revenue per hotel
    const revenueByHotel = {};
    hotels.forEach((h) => { revenueByHotel[h.hotelName] = 0; });
    bookings.forEach((b) => {
      if (b.status !== "cancelled" && b.hotel?.hotelName) {
        revenueByHotel[b.hotel.hotelName] = (revenueByHotel[b.hotel.hotelName] || 0) + b.totalPrice;
      }
    });

    res.json({
      success: true,
      stats: {
        totalHotels: hotels.length,
        totalRooms,
        totalBookings: bookings.length,
        totalRevenue,
        confirmed,
        pending,
        cancelled,
      },
      monthlyRevenue: Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue })),
      revenueByHotel: Object.entries(revenueByHotel).map(([hotel, revenue]) => ({ hotel, revenue })),
      recentBookings: bookings.slice(0, 5),
    });
  } catch (error) {
    next(error);
  }
};

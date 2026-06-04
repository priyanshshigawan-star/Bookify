import { Hotel, Room } from "../models/index.js";

// POST /api/hotel/register
export const registerHotel = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { hotelName, hotelAddress, city, rating, price, amenities, description, phone } = req.body;
    const image = req.file?.filename;

    if (!hotelName || !hotelAddress || !rating || !price || !image) {
      return res.status(400).json({ success: false, message: "Hotel name, address, rating, price, and image are required." });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: "Rating must be between 1 and 5." });
    }

    const amenitiesArr = typeof amenities === "string"
      ? amenities.split(",").map((a) => a.trim()).filter(Boolean)
      : Array.isArray(amenities) ? amenities : [];

    const newHotel = await Hotel.create({
      hotelName: hotelName.trim(),
      hotelAddress: hotelAddress.trim(),
      city: city || "Mumbai",
      rating: parseFloat(rating),
      price: parseFloat(price),
      amenities: amenitiesArr,
      image,
      description: description || "",
      phone: phone || "",
      owner: id,
    });

    return res.status(201).json({ success: true, message: "Hotel registered successfully!", hotel: newHotel });
  } catch (error) {
    next(error);
  }
};

// GET /api/hotel/owner
export const getOwnerHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find({ owner: req.user.id }).sort({ createdAt: -1 });
    return res.json({ success: true, hotels });
  } catch (error) {
    next(error);
  }
};

// GET /api/hotel/all
export const getAllHotels = async (req, res, next) => {
  try {
    const { city, minPrice, maxPrice, rating, search, sort } = req.query;
    const filter = { isActive: true };

    if (city && city !== "all") filter.city = { $regex: city, $options: "i" };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (rating) filter.rating = { $gte: parseFloat(rating) };
    if (search) {
      filter.$or = [
        { hotelName: { $regex: search, $options: "i" } },
        { hotelAddress: { $regex: search, $options: "i" } },
        { city: { $regex: search, $options: "i" } },
      ];
    }

    let sortObj = { createdAt: -1 };
    if (sort === "price_asc") sortObj = { price: 1 };
    if (sort === "price_desc") sortObj = { price: -1 };
    if (sort === "rating") sortObj = { rating: -1 };

    const hotels = await Hotel.find(filter).populate("owner", "name email").sort(sortObj);
    return res.json({ success: true, hotels, total: hotels.length });
  } catch (error) {
    next(error);
  }
};

// GET /api/hotel/:id
export const getHotelById = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate("owner", "name email phone");
    if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found." });
    const rooms = await Room.find({ hotel: hotel._id, isAvailable: true });
    res.json({ success: true, hotel, rooms });
  } catch (error) {
    next(error);
  }
};

// PUT /api/hotel/:id
export const updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found." });
    if (hotel.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }

    const { hotelName, hotelAddress, city, rating, price, amenities, description, phone } = req.body;
    const updates = {};
    if (hotelName) updates.hotelName = hotelName.trim();
    if (hotelAddress) updates.hotelAddress = hotelAddress.trim();
    if (city) updates.city = city;
    if (rating) updates.rating = parseFloat(rating);
    if (price) updates.price = parseFloat(price);
    if (description !== undefined) updates.description = description;
    if (phone) updates.phone = phone;
    if (req.file) updates.image = req.file.filename;
    if (amenities) {
      updates.amenities = typeof amenities === "string"
        ? amenities.split(",").map((a) => a.trim()).filter(Boolean)
        : amenities;
    }

    const updated = await Hotel.findByIdAndUpdate(req.params.id, updates, { new: true });
    res.json({ success: true, message: "Hotel updated successfully.", hotel: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/hotel/:id
export const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found." });
    if (hotel.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized." });
    }
    await Hotel.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: "Hotel deleted successfully." });
  } catch (error) {
    next(error);
  }
};

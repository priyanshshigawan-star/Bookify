import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendBookingConfirmationEmail = async ({ to, name, booking, room, hotel }) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Georgia', serif; background: #f5f0e8; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #0a0e1a 0%, #1a2340 100%); padding: 40px; text-align: center; }
        .header h1 { color: #d4af37; font-size: 32px; margin: 0; letter-spacing: 2px; }
        .header p { color: #f5f0e8; margin: 8px 0 0; opacity: 0.8; }
        .body { padding: 40px; }
        .greeting { font-size: 18px; color: #333; margin-bottom: 20px; }
        .booking-card { background: #f9f7f2; border: 1px solid #e0d5b0; border-radius: 8px; padding: 24px; margin: 24px 0; }
        .booking-card h2 { color: #0a0e1a; font-size: 20px; margin: 0 0 16px; border-bottom: 2px solid #d4af37; padding-bottom: 8px; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #ede8d5; }
        .detail-label { color: #666; font-size: 14px; }
        .detail-value { color: #333; font-weight: 600; font-size: 14px; }
        .total-row { display: flex; justify-content: space-between; padding: 12px 0; margin-top: 8px; }
        .total-label { color: #0a0e1a; font-size: 16px; font-weight: 700; }
        .total-value { color: #d4af37; font-size: 20px; font-weight: 700; }
        .footer { background: #0a0e1a; padding: 24px; text-align: center; }
        .footer p { color: #888; font-size: 12px; margin: 4px 0; }
        .badge { display: inline-block; background: #d4af37; color: #0a0e1a; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-top: 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✦ BOOKIFY</h1>
          <p>Premium Hotel Booking Experience</p>
        </div>
        <div class="body">
          <p class="greeting">Dear <strong>${name}</strong>,</p>
          <p style="color:#555;">Your booking has been confirmed! Here are your reservation details:</p>
          <div class="booking-card">
            <h2>🏨 Booking Confirmation</h2>
            <div class="detail-row">
              <span class="detail-label">Booking ID</span>
              <span class="detail-value">#${booking._id?.toString().slice(-8).toUpperCase()}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Hotel</span>
              <span class="detail-value">${hotel.hotelName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Room Type</span>
              <span class="detail-value">${room.roomType}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Check-In</span>
              <span class="detail-value">${new Date(booking.checkIn).toDateString()}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Check-Out</span>
              <span class="detail-value">${new Date(booking.checkOut).toDateString()}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Guests</span>
              <span class="detail-value">${booking.persons} Person(s)</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Payment</span>
              <span class="detail-value">${booking.paymentMethod}</span>
            </div>
            <div class="total-row">
              <span class="total-label">Total Amount</span>
              <span class="total-value">$${booking.totalPrice}</span>
            </div>
          </div>
          <p style="color:#555; font-size:14px;">Thank you for choosing Bookify. We look forward to welcoming you!</p>
          <div style="text-align:center; margin-top:24px;">
            <span class="badge">✦ CONFIRMED</span>
          </div>
        </div>
        <div class="footer">
          <p>© 2025 Bookify — Premium Hotel Booking</p>
          <p>Need help? Contact support@bookify.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: `"Bookify" <${process.env.SENDER_EMAIL}>`,
      to,
      subject: "✦ Booking Confirmed — Bookify",
      html,
    });
  } catch (err) {
    console.error("Email send error:", err.message);
    // Don't throw - email failure shouldn't break booking
  }
};

export default transporter;

// ========== USER MODEL ==========
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"], trim: true, minlength: 2, maxlength: 50 },
  email: { type: String, required: [true, "Email is required"], unique: true, lowercase: true, trim: true },
  role: { type: String, required: true, enum: ["user", "owner"], default: "user" },
  password: { type: String, required: [true, "Password is required"], minlength: 6 },
  avatar: { type: String, default: "" },
  phone: { type: String, default: "" },
  loyaltyPoints: { type: Number, default: 0 },
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);

// ========== HOTEL MODEL ==========
const hotelSchema = new mongoose.Schema({
  hotelName: { type: String, required: true, trim: true },
  hotelAddress: { type: String, required: true },
  city: { type: String, required: true, default: "Mumbai" },
  rating: { type: Number, required: true, min: 1, max: 5 },
  price: { type: Number, required: true },
  amenities: [{ type: String }],
  image: { type: String, required: true },
  description: { type: String, default: "" },
  phone: { type: String, default: "" },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Hotel = mongoose.model("Hotel", hotelSchema);

// ========== ROOM MODEL ==========
const hotelRoomSchema = new mongoose.Schema({
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
  roomType: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  amenities: [{ type: String }],
  isAvailable: { type: Boolean, default: true },
  maxGuests: { type: Number, default: 2 },
  size: { type: String, default: "" },
  beds: { type: Number, default: 1 },
}, { timestamps: true });

export const Room = mongoose.model("Room", hotelRoomSchema);

// ========== BOOKING MODEL ==========
const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  persons: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ["confirmed", "pending", "cancelled"], default: "pending" },
  totalPrice: { type: Number, required: true },
  paymentMethod: { type: String, default: "Pay At Hotel", required: true },
  isPaid: { type: Boolean, default: false },
  specialRequests: { type: String, default: "" },
  loyaltyPointsEarned: { type: Number, default: 0 },
}, { timestamps: true });

export const Booking = mongoose.model("Booking", bookingSchema);

// ========== REVIEW MODEL ==========
const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
  booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String, required: true, maxlength: 100 },
  comment: { type: String, required: true, maxlength: 1000 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

export const Review = mongoose.model("Review", reviewSchema);

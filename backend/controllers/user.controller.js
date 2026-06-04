import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const generateToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// POST /api/user/signup
export const signup = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Validation
    if (!name?.trim() || !email?.trim() || !password || !role) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format." });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
    }
    if (!["user", "owner"].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered. Please login." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role,
      phone: phone || "",
    });

    const token = generateToken(newUser);
    const userObj = newUser.toObject();
    delete userObj.password;

    res.cookie("token", token, cookieOptions);
    return res.status(201).json({
      success: true,
      message: "Account created successfully! Welcome to Bookify.",
      user: userObj,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/user/login
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }
    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Account is deactivated." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const token = generateToken(user);
    const userObj = user.toObject();
    delete userObj.password;

    res.cookie("token", token, cookieOptions);
    return res.json({ success: true, message: "Welcome back!", user: userObj, token });
  } catch (error) {
    next(error);
  }
};

// POST /api/user/logout
export const logout = async (req, res) => {
  res.clearCookie("token", { ...cookieOptions, maxAge: 0 });
  return res.json({ success: true, message: "Logged out successfully." });
};

// GET /api/user/me
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password").populate("wishlist");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// PUT /api/user/profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    const updates = {};
    if (name?.trim()) updates.name = name.trim();
    if (phone) updates.phone = phone;
    if (req.file) updates.avatar = req.file.filename;

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select("-password");
    res.json({ success: true, message: "Profile updated successfully.", user });
  } catch (error) {
    next(error);
  }
};

// POST /api/user/wishlist/:roomId
export const toggleWishlist = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const user = await User.findById(req.user.id);
    const idx = user.wishlist.indexOf(roomId);
    if (idx === -1) {
      user.wishlist.push(roomId);
    } else {
      user.wishlist.splice(idx, 1);
    }
    await user.save();
    res.json({ success: true, wishlist: user.wishlist, message: idx === -1 ? "Added to wishlist" : "Removed from wishlist" });
  } catch (error) {
    next(error);
  }
};

// GET /api/user/all (admin purposes)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users, total: users.length });
  } catch (error) {
    next(error);
  }
};

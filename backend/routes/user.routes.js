// routes/user.routes.js
import express from "express";
import { signup, login, logout, getMe, updateProfile, toggleWishlist, getAllUsers } from "../controllers/user.controller.js";
import { isAuthenticated, isOwner } from "../middlewares/index.js";
import { upload } from "../config/multer.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", isAuthenticated, getMe);
router.put("/profile", isAuthenticated, upload.single("avatar"), updateProfile);
router.post("/wishlist/:roomId", isAuthenticated, toggleWishlist);
router.get("/all", isAuthenticated, isOwner, getAllUsers);

export default router;

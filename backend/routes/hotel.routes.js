import express from "express";
import { registerHotel, getOwnerHotels, getAllHotels, getHotelById, updateHotel, deleteHotel } from "../controllers/hotel.controller.js";
import { isAuthenticated, isOwner } from "../middlewares/index.js";
import { upload } from "../config/multer.js";

const router = express.Router();
router.get("/all", getAllHotels);
router.get("/:id", getHotelById);
router.post("/register", isAuthenticated, isOwner, upload.single("image"), registerHotel);
router.get("/owner/list", isAuthenticated, isOwner, getOwnerHotels);
router.put("/:id", isAuthenticated, isOwner, upload.single("image"), updateHotel);
router.delete("/:id", isAuthenticated, isOwner, deleteHotel);

export default router;

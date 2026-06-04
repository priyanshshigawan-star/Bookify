// routes/room.routes.js
import express from "express";
import { addRoom, getOwnerRooms, getAllRooms, getRoomById, updateRoom, deleteRoom } from "../controllers/room.controller.js";
import { isAuthenticated, isOwner } from "../middlewares/index.js";
import { upload } from "../config/multer.js";

const roomRouter = express.Router();
roomRouter.get("/all", getAllRooms);
roomRouter.get("/:id", getRoomById);
roomRouter.post("/add", isAuthenticated, isOwner, upload.array("images", 6), addRoom);
roomRouter.get("/owner/list", isAuthenticated, isOwner, getOwnerRooms);
roomRouter.put("/:id", isAuthenticated, isOwner, upload.array("images", 6), updateRoom);
roomRouter.delete("/:id", isAuthenticated, isOwner, deleteRoom);

export { roomRouter };

// routes/booking.routes.js
import {
  bookRoom, getUserBookings, getHotelBookings, cancelBooking,
  checkRoomAvailability, stripePayment, stripeWebhook, updateBookingStatus, getOwnerDashboard
} from "../controllers/booking.controller.js";

const bookingRouter = express.Router();
bookingRouter.post("/check-availability", checkRoomAvailability);
bookingRouter.post("/book", isAuthenticated, bookRoom);
bookingRouter.get("/user", isAuthenticated, getUserBookings);
bookingRouter.get("/hotel", isAuthenticated, isOwner, getHotelBookings);
bookingRouter.get("/dashboard", isAuthenticated, isOwner, getOwnerDashboard);
bookingRouter.patch("/:id/cancel", isAuthenticated, cancelBooking);
bookingRouter.patch("/:id/status", isAuthenticated, isOwner, updateBookingStatus);
bookingRouter.post("/stripe-payment", isAuthenticated, stripePayment);
bookingRouter.post("/stripe-webhook", stripeWebhook);

export { bookingRouter };

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import { connectDB } from "./config/connectDB.js";
import userRouter from "./routes/user.routes.js";
import hotelRouter from "./routes/hotel.routes.js";
import { roomRouter } from "./routes/index.js";
import { bookingRouter } from "./routes/index.js";
import { errorHandler, notFound } from "./middlewares/index.js";

dotenv.config();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// ── Security ──────────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, message: { success: false, message: "Too many requests, please try again later." } });
app.use("/api", limiter);

// ── Core Middleware ───────────────────────────────────────────────────────────
app.use(cors({
  origin: [process.env.FRONTEND_URL || "http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// ── Static Files ─────────────────────────────────────────────────────────────
app.use("/images", express.static(path.join(__dirname, "uploads")));

// ── Routes ────────────────────────────────────────────────────────────────────
app.get("/", (req, res) => res.json({ message: "🏨 Bookify API v2.0 — Running", status: "OK" }));
app.use("/api/user", userRouter);
app.use("/api/hotel", hotelRouter);
app.use("/api/room", roomRouter);
app.use("/api/bookings", bookingRouter);

// ── Error Handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n✅ Bookify Server running at http://localhost:${PORT}`);
    console.log(`📚 Environment: ${process.env.NODE_ENV || "development"}\n`);
  });
});

export default app;

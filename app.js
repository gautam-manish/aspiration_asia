import dotenv from "dotenv";
dotenv.config({ quiet: true });

import express from "express";
import cors from "cors";
import connectDB from "./Config/db.js";
import authRoute from "./Routes/authRoutes.js";
import hotelRoute from "./Routes/hotelRoutes.js";
import emailRoute from "./Routes/emailRoutes.js";
import reservationRoute from "./Routes/reservationRoutes.js";
import voucherRoute from "./Routes/voucherRoutes.js";
import authMiddleware from "./Middleware/authMiddleware.js";

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// ── Public Routes ─────────────────────────
app.use("/api/auth", authRoute);

// ── Protected Routes (require JWT) ────────
app.use("/api/hotels", authMiddleware, hotelRoute);
app.use("/api/mail", authMiddleware, emailRoute);
app.use("/api/reservations", authMiddleware, reservationRoute);
app.use("/api/vouchers", authMiddleware, voucherRoute);

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
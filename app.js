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
import invoiceRoute from "./Routes/invoiceRoutes.js";
import cashReceiptRoute from "./Routes/cashReceiptRoutes.js";
import calculatorRoute from "./Routes/calculatorRoutes.js";
import authMiddleware from "./Middleware/authMiddleware.js";
import clientRoutes from './Routes/clientRoutes.js';
import queryRoute from './Routes/queryRoutes.js';
import bookingRoute from './Routes/bookingRoutes.js';

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Public
app.use("/api/auth", authRoute);

// Protected
app.use("/api/hotels",        authMiddleware, hotelRoute);
app.use("/api/mail",          authMiddleware, emailRoute);
app.use("/api/reservations",  authMiddleware, reservationRoute);
app.use("/api/vouchers",      authMiddleware, voucherRoute);
app.use("/api/invoices",      authMiddleware, invoiceRoute);
app.use("/api/cash-receipts", authMiddleware, cashReceiptRoute);
app.use("/api/calculator",    authMiddleware, calculatorRoute);
app.use('/api/clients', clientRoutes);
app.use("/api/queries",      authMiddleware, queryRoute);
app.use("/api/bookings",     authMiddleware, bookingRoute);

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});



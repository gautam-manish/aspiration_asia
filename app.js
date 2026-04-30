import dotenv from "dotenv";
dotenv.config({ quiet: true });

import express from "express";
import cors from "cors";
import connectDB from "./Config/db.js";
import hotelRoute from "./Routes/hotelRoutes.js";
import emailRoute from "./Routes/emailRoutes.js";
import reservationRoute from "./Routes/reservationRoutes.js";
import voucherRoute from "./Routes/voucherRoutes.js";

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/hotels", hotelRoute);
app.use("/api/mail", emailRoute);
app.use("/api/reservations", reservationRoute);
app.use("/api/vouchers", voucherRoute);

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
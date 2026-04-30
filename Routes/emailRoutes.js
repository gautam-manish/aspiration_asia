import express from "express";
import { sendPackageMail, sendReservationMail } from "../Controller/emailController.js";

const router = express.Router();

// ─────────────────────────────────────────
// Base Route: /api/mail
// ─────────────────────────────────────────
router.post("/send-mail", sendPackageMail);
router.post("/send-reservation", sendReservationMail);

export default router;
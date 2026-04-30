import express from "express";
import { login, verifyToken } from "../Controller/authController.js";
import authMiddleware from "../Middleware/authMiddleware.js";

const router = express.Router();

// ─────────────────────────────────────────
// Base Route: /api/auth
// ─────────────────────────────────────────
router.post("/login", login);
router.get("/verify", authMiddleware, verifyToken);

export default router;
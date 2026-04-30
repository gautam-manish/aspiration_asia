import express from "express";
import {
  createReservation,
  getAllReservations,
  getReservationById,
} from "../Controller/reservationController.js";

const router = express.Router();

// ─────────────────────────────────────────
// Base Route: /api/reservations
// ─────────────────────────────────────────
router.route("/").get(getAllReservations).post(createReservation);
router.route("/:id").get(getReservationById);

export default router;
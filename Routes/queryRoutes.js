import express from "express";
import {
  getNextQueryId,
  createQuery,
  getAllQueries,
  getQueryById,
  updateQuery,
  updateQueryStatus,
} from "../Controller/bookingController.js";

const router = express.Router();

// ─────────────────────────────────────────
// Base Route: /api/queries
// ─────────────────────────────────────────
router.route("/next-id").get(getNextQueryId);       // GET  /api/queries/next-id
router.route("/").get(getAllQueries).post(createQuery); // GET  /api/queries  |  POST /api/queries
router.route("/:id").get(getQueryById).put(updateQuery); // GET  /api/queries/:id  |  PUT /api/queries/:id
router.route("/:id/status").patch(updateQueryStatus);  // PATCH /api/queries/:id/status

export default router;

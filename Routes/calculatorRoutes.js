import express from "express";
import {
  createCalculator,
  getAllCalculators,
  getCalculatorById,
  updateCalculator,
  deleteCalculator,
} from "../Controller/calculatorController.js";

const router = express.Router();

router.route("/").get(getAllCalculators).post(createCalculator);
router.route("/:id").get(getCalculatorById).put(updateCalculator).delete(deleteCalculator);

export default router;
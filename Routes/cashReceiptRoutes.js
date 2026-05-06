import express from "express";
import {
  createCashReceipt,
  getAllCashReceipts,
  getCashReceiptById,
  deleteCashReceipt,
} from "../Controller/cashReceiptController.js";

const router = express.Router();

router.route("/").get(getAllCashReceipts).post(createCashReceipt);
router.route("/:id").get(getCashReceiptById).delete(deleteCashReceipt);

export default router;
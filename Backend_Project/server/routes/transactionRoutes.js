import express from "express";
import { deposit, withdraw, transfer, myTransactions } from "../controllers/transactionController.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/deposit", protect, deposit);
router.post("/withdraw", protect, withdraw);
router.post("/transfer", protect, transfer);
router.get("/my", protect, myTransactions);

export default router;

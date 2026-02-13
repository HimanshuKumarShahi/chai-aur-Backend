import express from "express";
import { createAccount, getBalance, getMyAccounts } from "../controllers/accountController.js";
import { protect } from "../middleware/authmiddleware.js";

const router = express.Router();

router.post("/create", protect, createAccount);
router.get("/my", protect, getMyAccounts);
router.get("/balance", protect, getBalance);

export default router;

import express from 'express';
import { createAccount, getBalance } from '../controllers/accountController.js';
import { protect } from '../middleware/authmiddleware.js';

const router = express.Router();


router.post('/create', protect, createAccount);
router.get('/balance', protect, getBalance);

export default router;
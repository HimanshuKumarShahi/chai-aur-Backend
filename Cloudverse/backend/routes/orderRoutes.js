import express from 'express';
import { placeOrder } from '../controllers/orderController.js';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/place', requireAuth, requireRole('customer'), placeOrder);

export default router;
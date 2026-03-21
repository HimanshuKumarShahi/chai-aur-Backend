import express from 'express';
import { placeOrder } from '../controllers/orderController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// This becomes: POST http://localhost:5000/api/orders/place
router.post('/place', requireAuth, placeOrder);

export default router;
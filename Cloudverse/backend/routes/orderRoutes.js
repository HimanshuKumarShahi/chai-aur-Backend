import express from 'express';
import { placeOrder, getAdminStats } from '../controllers/orderController.js';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

// 🔹 User Route: Place a new order
router.post('/place', requireAuth, placeOrder);

router.post('/place', requireAuth, placeOrder);
router.get('/admin/stats', requireAuth, requireRole('admin'), getAdminStats);
// 🔹 Admin Route: Fetch revenue and total order count for the dashboard
// URL: http://localhost:5000/api/orders/admin/stats
router.get('/admin/stats', requireAuth, requireRole('admin'), getAdminStats);

export default router;
import express from 'express';
import { createRestaurant, getAllRestaurants } from '../controllers/restaurantController.js';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/create', requireAuth, requireRole('admin'), createRestaurant);
router.get('/', getAllRestaurants);

export default router;
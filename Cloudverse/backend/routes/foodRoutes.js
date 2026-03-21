import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import { addFoodItem, getFoodByRestaurant } from '../controllers/foodController.js';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post(
  '/add',
  requireAuth,
  requireRole('admin', 'restaurant_owner'),
  upload.single('image'),
  addFoodItem
);

router.get('/restaurant/:restaurantId', getFoodByRestaurant);

export default router;
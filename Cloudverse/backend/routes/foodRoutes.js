import express from 'express';
import { 
  addFoodItem, 
  getFoodByRestaurant, 
  deleteFoodItem,
  getAllFoodItems // Added for Admin Management
} from '../controllers/foodController.js';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/food/add
 * @desc    Admin adds a new food item to a restaurant
 * @access  Private (Admin Only)
 */
router.post('/add', requireAuth, requireRole('admin'), addFoodItem);

/**
 * @route   GET /api/food/restaurant/:restaurantId
 * @desc    Get all food items for a specific restaurant
 * @access  Public
 */
router.get('/restaurant/:restaurantId', getFoodByRestaurant);

/**
 * @route   GET /api/food/all
 * @desc    Admin fetches all food items (useful for a global manager)
 * @access  Private (Admin Only)
 */
router.get('/all', requireAuth, requireRole('admin'), getAllFoodItems);

router.post('/add', requireAuth, requireRole('admin'), addFoodItem);
router.delete('/delete/:id', requireAuth, requireRole('admin'), deleteFoodItem);

/**
 * @route   DELETE /api/food/delete/:id
 * @desc    Admin deletes a specific food item by its MongoDB ID
 * @access  Private (Admin Only)
 */
router.delete('/delete/:id', requireAuth, requireRole('admin'), deleteFoodItem);

export default router;
import express from 'express';
import { addFoodItem, getFoodByRestaurant } from '../controllers/foodController.js';
import { requireAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// No Multer needed anymore because we are using direct links!
router.post('/add', requireAuth, addFoodItem);
router.get('/restaurant/:restaurantId', getFoodByRestaurant);

export default router;
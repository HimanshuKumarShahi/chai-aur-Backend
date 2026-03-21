import express from 'express';
import upload from '../middlewares/uploadMiddleware.js';
import { addFoodItem, getFoodByRestaurant } from '../controllers/foodController.js';

const router = express.Router();

router.post('/add', upload.single('image'), addFoodItem);
router.get('/restaurant/:restaurantId', getFoodByRestaurant);

export default router;
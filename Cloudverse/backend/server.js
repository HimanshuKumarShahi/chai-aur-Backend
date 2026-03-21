import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';

import foodRoutes from './routes/foodRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import userRoutes from './routes/userRoutes.js'; // 1. Import the new route

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/food', foodRoutes);
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes); // 2. Mount the new route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Cloudverse Server is running on port ${PORT}`);
});
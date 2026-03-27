import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import { connectDB } from './src/config/db.js'; // FIX: Use named import

import courseRoutes from './src/routes/courseRoutes.js';
import userRoutes from './src/routes/userRoutes.js'; 

const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Routes
app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);

app.get('/',(req , res)=>{
  res.send("Working")
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 AH Academy Server running on http://localhost:${PORT}`));
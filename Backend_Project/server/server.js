import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from "./routes/authRoutes.js"
import { protect } from './middleware/authmiddleware.js';

dotenv.config();

const app=express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use("/api/auth",authRoutes);

app.get('/',(req,res)=>{
    res.send("Server is Running 👍🏼");
});

app.get("/api/private", protect, (req, res) => {
  res.json({
    message: "Welcome to private route 🔐",
    user: req.user,
  });
});



const PORT=process.env.PORT ||5050;

app.listen(PORT,()=>{
    console.log(` ✅ Server is running on PORT ${PORT}`);
});
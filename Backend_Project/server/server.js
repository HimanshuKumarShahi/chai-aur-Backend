import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from "./routes/authRoutes.js"

dotenv.config();

const app=express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth",authRoutes);

app.get('/',(req,res)=>{
    res.send("Server is Running 👍🏼");
});

const PORT=process.env.PORT ||5050;

app.listen(PORT,()=>{
    console.log(` ✅ Server is running on PORT ${PORT}`);
});
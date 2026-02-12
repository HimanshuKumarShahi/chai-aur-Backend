import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

const app=express();

const PORT=process.env.PORT ||5050;

app.use(cors());
app.use(express.json());

connectDB();

app.get('/',(req,res)=>{
    res.send("Server is Running 👍🏼");
});

app.listen(PORT,()=>{
    console.log(` ✅ Server is running on PORT ${PORT}`);
});
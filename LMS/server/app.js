import express from 'express'
import cors from 'cors'
import userRoutes from './routes/user.route.js'
import cookieParser from 'cookie-parser';

const app=express();

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true
}));
app.use(cookieParser())
app.use(express.json())

app.use('/api/auth',userRoutes)


export default app;
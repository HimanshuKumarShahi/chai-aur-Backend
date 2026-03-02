import express from 'express'
import cors from 'cors'
import userRoutes from './routes/user.route.js'
import cookieParser from 'cookie-parser';

const app=express();

app.use(cors({
    credentials: true
}));
app.use(cookieParser())
app.use(express.json())

app.use('/api/auth',userRoutes)


export default app;
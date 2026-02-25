import express from 'express'
import cors from 'cors'
import userRoutes from './routes/user.route.js'

const app=express();

app.use(cors())
app.use(express.json())

app.use('/api/users',userRoutes)

app.get('/',(req,res)=>{
    res.send("Running ...")
});

export default app;
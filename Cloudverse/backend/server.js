require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const foodRoutes = require('./routes/foodRoutes');


const app = express();


connectDB();


app.use(cors()); 
app.use(express.json()); 

app.use('/api/food', foodRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Cloudverse Server is running on port ${PORT}`);
});
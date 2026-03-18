const express = require('express');
const router = express.Router();
const multer = require('multer');
const { cloudinary } = require('../config/cloudinary');
const FoodItem = require('../models/FoodItem');

// 1. Setup Multer to store the incoming image in memory temporarily
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route: POST /api/food/add
router.post('/add', upload.single('image'), async (req, res) => {
    try {
        const { name, description, price, category, stockCount } = req.body;
        
        // 2. Convert the image buffer from memory into a format Cloudinary can read (base64)
        const base64Image = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;
        
        // 3. Upload directly using the official Cloudinary SDK
        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
            folder: 'cloudverse_menu',
            transformation: [{ width: 800, height: 600, crop: 'fill' }] 
        });

        // 4. Save the new food item to MongoDB
        const newItem = new FoodItem({
            name,
            description,
            price,
            category,
            stockCount,
            image: uploadResponse.secure_url // The working, secure Cloudinary link!
        });

        await newItem.save();
        res.status(201).json({ message: "Food item added to Cloudverse!", item: newItem });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Upload failed: " + error.message });
    }
});

module.exports = router;
import { cloudinary } from '../config/cloudinary.js';
import FoodItem from '../models/FoodItem.js';

export const addFoodItem = async (req, res) => {
    try {
        const { name, description, price, category, restaurant, isVegetarian } = req.body;
        
        if (!req.file) return res.status(400).json({ message: "Image is required" });

        const base64Image = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;
        
        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
            folder: 'cloudverse_menu',
            transformation: [{ width: 800, height: 600, crop: 'fill' }] 
        });

        const newItem = new FoodItem({
            name, description, price, category, restaurant, isVegetarian,
            image: uploadResponse.secure_url
        });

        await newItem.save();
        res.status(201).json({ message: "Food item added!", item: newItem });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error: " + error.message });
    }
};

export const getFoodByRestaurant = async (req, res) => {
    try {
        const foodItems = await FoodItem.find({ restaurant: req.params.restaurantId });
        res.status(200).json(foodItems);
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};
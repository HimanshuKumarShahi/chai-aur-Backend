import { cloudinary } from '../config/cloudinary.js';
import FoodItem from '../models/FoodItem.js';
import Restaurant from '../models/Restaurant.js';

export const addFoodItem = async (req, res) => {
    try {
        const { name, description, price, category, restaurantId, isVegetarian } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        // 🔥 Ownership check
        if (
            req.user.role === 'restaurant_owner' &&
            restaurant.ownerId !== req.user.clerkUserId
        ) {
            return res.status(403).json({ message: "Not your restaurant" });
        }

        // Upload image
        const base64Image = Buffer.from(req.file.buffer).toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;

        const uploadResponse = await cloudinary.uploader.upload(dataURI, {
            folder: 'cloudverse_menu'
        });

        const newItem = new FoodItem({
            name,
            description,
            price,
            category,
            restaurant: restaurantId,
            isVegetarian,
            image: uploadResponse.secure_url
        });

        await newItem.save();

        res.status(201).json({
            message: "Food item added",
            item: newItem
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getFoodByRestaurant = async (req, res) => {
    try {
        const foodItems = await FoodItem.find({
            restaurant: req.params.restaurantId
        });

        res.status(200).json(foodItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
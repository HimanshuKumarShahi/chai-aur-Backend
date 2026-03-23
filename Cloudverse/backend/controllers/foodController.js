import Food from '../models/foodItem.js';
import Restaurant from '../models/Restaurant.js';

// --- 1. ADD FOOD ITEM (Revenue & Type Safety) ---
export const addFoodItem = async (req, res) => {
  try {
    const { name, description, price, category, isVegetarian, restaurant, image } = req.body;

    if (!restaurant) return res.status(400).json({ message: "Restaurant ID is required" });

    const newFood = new Food({
      name,
      description,
      price: Number(price), // 🔥 CRITICAL: Force number for revenue math
      category,
      isVegetarian: isVegetarian === "true" || isVegetarian === true,
      restaurant,
      image
    });

    await newFood.save();
    res.status(201).json(newFood);
  } catch (error) {
    console.error("Add Food Error:", error);
    res.status(500).json({ message: "Failed to add food item" });
  }
};

// --- 2. DELETE FOOD ITEM (The 404 Fix) ---
export const deleteFoodItem = async (req, res) => {
  try {
    const { id } = req.params; // 🔥 Extracts the :id from the route URL

    const deletedItem = await Food.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Food item not found in Database" });
    }

    res.status(200).json({ 
      success: true, 
      message: "✅ Food item purged from Cloudverse" 
    });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Internal Server Error during deletion" });
  }
};

// --- 3. GET FOOD BY RESTAURANT ---
export const getFoodByRestaurant = async (req, res) => {
  try {
    const foods = await Food.find({ restaurant: req.params.restaurantId });
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: "Error fetching restaurant menu" });
  }
};

// --- 4. GET ALL FOOD (Admin Utility) ---
export const getAllFoodItems = async (req, res) => {
  try {
    const foods = await Food.find().populate('restaurant', 'name');
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: "Error fetching global menu" });
  }
};
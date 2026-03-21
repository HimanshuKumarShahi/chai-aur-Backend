import Food from '../models/foodItem.js'; // Ensure the filename is exactly 'foodItem.js'
import Restaurant from '../models/Restaurant.js';

// --- 1. ADD FOOD ITEM (URL LINK MODE) ---
export const addFoodItem = async (req, res) => {
  try {
    // We pull 'image' from the body now, not the file!
    const { name, description, price, category, isVegetarian, restaurant, image } = req.body;

    // Validation: Check if the ID was actually sent
    if (!restaurant) {
      return res.status(400).json({ message: "No Restaurant ID provided" });
    }

    // Check if the restaurant exists in your MongoDB
    const existingRestaurant = await Restaurant.findById(restaurant);
    if (!existingRestaurant) {
      return res.status(404).json({ message: "❌ Restaurant not found in database" });
    }

    const newFood = new Food({
      name,
      description,
      price: Number(price),
      category,
      isVegetarian: isVegetarian === "true", 
      restaurant, 
      image: image // This saves the Unsplash link you paste
    });

    await newFood.save();
    res.status(201).json(newFood);
  } catch (error) {
    console.error("Add Food Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// --- 2. GET FOOD BY RESTAURANT ---
export const getFoodByRestaurant = async (req, res) => {
    try {
        const foods = await Food.find({ restaurant: req.params.restaurantId });
        res.status(200).json(foods);
    } catch (error) {
        res.status(500).json({ message: "Error fetching food items" });
    }
};

// --- 3. DELETE FOOD ITEM ---
export const deleteFoodItem = async (req, res) => {
    try {
        const foodId = req.params.id;
        const deletedItem = await Food.findByIdAndDelete(foodId);
        
        if (!deletedItem) {
            return res.status(404).json({ message: "Food item not found" });
        }
        
        res.status(200).json({ message: "Food item deleted successfully" });
    } catch (error) {
        console.error("Delete Food Error:", error);
        res.status(500).json({ message: "Error deleting food item" });
    }
};
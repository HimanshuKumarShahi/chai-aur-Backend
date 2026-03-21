import Restaurant from '../models/Restaurant.js';

export const createRestaurant = async (req, res) => {
    try {
        const { name, address, image, cuisine } = req.body;

        const newRestaurant = new Restaurant({
            name,
            address,
            image,
            cuisine,
            ownerId: req.user.clerkUserId // secure owner
        });

        await newRestaurant.save();

        res.status(201).json({
            message: "Restaurant created",
            restaurant: newRestaurant
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
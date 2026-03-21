import Order from '../models/Order.js';

export const placeOrder = async (req, res) => {
    try {
        const { clerkUserId, restaurant, items, totalAmount, deliveryAddress } = req.body;
        const newOrder = new Order({ clerkUserId, restaurant, items, totalAmount, deliveryAddress });
        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully!", order: newOrder });
    } catch (error) {
        res.status(500).json({ message: "Server error: " + error.message });
    }
};
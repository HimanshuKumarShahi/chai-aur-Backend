import Order from '../models/Order.js';

export const placeOrder = async (req, res) => {
    try {
        const { restaurant, items, totalAmount, deliveryAddress } = req.body;

        const newOrder = new Order({
            clerkUserId: req.user.clerkUserId, // secure
            restaurant,
            items,
            totalAmount,
            deliveryAddress
        });

        await newOrder.save();

        res.status(201).json({
            message: "Order placed",
            order: newOrder
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
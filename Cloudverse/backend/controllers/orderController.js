import Order from '../models/Order.js';

export const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    // Use req.auth.userId (provided by Clerk middleware)
    const newOrder = new Order({
      userId: req.auth.userId, 
      items,
      totalAmount
    });

    await newOrder.save();
    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Order Save Error:", error);
    res.status(500).json({ message: "Failed to record order" });
  }
};
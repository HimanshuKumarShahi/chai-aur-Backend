import Order from '../models/Order.js';

// --- 1. PLACE ORDER (Revenue Fix) ---
export const placeOrder = async (req, res) => {
  try {
    const { items, totalAmount, deliveryAddress } = req.body;

    const newOrder = new Order({
      clerkUserId: req.auth.userId, // Matches your User Sync logic
      items,
      totalAmount: Number(totalAmount), // 🔥 FORCE NUMBER for Revenue calculation
      deliveryAddress,
      status: 'paid'
    });

    await newOrder.save();
    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Order Save Error:", error);
    res.status(500).json({ message: "Failed to record order" });
  }
};

// --- 2. GET ADMIN DASHBOARD STATS (New) ---
export const getAdminStats = async (req, res) => {
  try {
    const orders = await Order.find();
    
    // Calculate stats directly from DB
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    res.status(200).json({
      totalOrders,
      totalRevenue: Math.round(totalRevenue)
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
};
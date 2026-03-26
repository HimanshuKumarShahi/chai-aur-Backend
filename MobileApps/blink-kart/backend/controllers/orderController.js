import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  const order = await Order.create({
    userId: req.user,
    items: req.body.items,
    total: req.body.total,
  });

  res.json(order);
};
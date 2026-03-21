import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Clerk User ID
  items: [
    {
      foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
      name: String,
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: "Placed" }, // Placed, Preparing, Out for Delivery
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Order', orderSchema);
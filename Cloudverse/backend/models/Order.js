import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    clerkUserId: { type: String, required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [{
        foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
        quantity: { type: Number, required: true, min: 1 }
    }],
    totalAmount: { type: Number, required: true },
    deliveryAddress: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Placed', 'Accepted', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'],
        default: 'Placed' 
    }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    isVegetarian: { type: Boolean, default: true },
    restaurant: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Restaurant', 
        required: true 
    }
}, { timestamps: true });

export default mongoose.model('FoodItem', foodItemSchema);
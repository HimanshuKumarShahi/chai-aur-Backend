import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    image: { type: String, required: true }, 
    cuisine: [{ type: String }], 
    rating: { type: Number, default: 0 },
    ownerId: { type: String, required: true } 
}, { timestamps: true });

export default mongoose.model('Restaurant', restaurantSchema);
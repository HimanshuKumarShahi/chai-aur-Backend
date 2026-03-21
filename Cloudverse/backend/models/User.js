import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    clerkUserId: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    role: { 
        type: String, 
        enum: ['customer', 'restaurant_owner', 'admin'], 
        default: 'customer' 
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
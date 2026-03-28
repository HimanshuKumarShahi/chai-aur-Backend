import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true , index: true},
  email: { type: String, required: true , lowercase: true },
  name: { type: String , required:true },
  role: {
    type: String,
    default: "user"
  },
  isBlocked: { 
    type: Boolean, 
    default: false 
  },
  mobile: String,
  portfolio: String,
  twitter: String,
  instagram: String,
  github: String,
  leetcode: String,
}, { timestamps: true });

export default mongoose.model("User", userSchema);
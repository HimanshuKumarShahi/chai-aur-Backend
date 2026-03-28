import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: String,
  email: String,
  name: String,
  role: {
    type: String,
    default: "user"
  }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
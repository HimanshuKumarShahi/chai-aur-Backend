import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: Number,
    image: String,
    category: String
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: String,

  price: {
    type: Number,
    required: true
  },

  image: String,

  category: String,

  stock: {
    type: Number,
    default: 1
  }

}, { timestamps: true });

export default mongoose.model("Product", productSchema);
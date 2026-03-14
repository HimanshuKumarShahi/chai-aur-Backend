import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

export const createProduct = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

  
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "ecommerce_products"
    });

    fs.unlinkSync(req.file.path);

    const product = await Product.create({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      image: result.secure_url,
      category: req.body.category
    });

    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }); 
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

export const createProduct = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    const product = await Product.create({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      image: result.secure_url,
      category: req.body.category
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};
import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

export const createProduct = async (req, res) => {

  try {

    if (!req.file) {
      return res.status(400).json({ message: "Image required" });
    }

    const upload = await cloudinary.uploader.upload(req.file.path);

    const product = await Product.create({

      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: upload.secure_url

    });

    res.json(product);

  } catch (error) {

    res.status(500).json({ message: error.message });

  }

};

export const getProducts = async (req, res) => {

  const products = await Product.find().sort({ createdAt: -1 });

  res.json(products);

};
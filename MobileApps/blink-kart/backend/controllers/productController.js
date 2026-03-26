import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

export const createProduct = async (req, res) => {
  const file = req.file;

  const uploaded = await cloudinary.uploader.upload(file.path);

  const product = await Product.create({
    name: req.body.name,
    price: req.body.price,
    image: uploaded.secure_url,
    description: req.body.description,
    stock: req.body.stock,
  });

  res.json(product);
};

export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};
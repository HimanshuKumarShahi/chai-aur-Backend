import express from "express";
import { createProduct, getProducts } from "../controllers/productController.js";
import upload from "../utils/upload.js";

const router = express.Router();

router.get("/", getProducts);

router.post("/", upload.single("image"), createProduct);

export default router;
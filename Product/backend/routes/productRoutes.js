import express from "express";
import multer from "multer";
import { createProduct, getProducts } from "../controllers/productController.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("image"), createProduct);
router.get("/", getProducts);

export default router;
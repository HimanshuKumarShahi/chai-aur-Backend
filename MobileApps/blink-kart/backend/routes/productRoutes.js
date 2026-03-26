import express from "express";
import { createProduct, getProducts } from "../controllers/productController.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = express.Router();

router.post("/", upload.single("image"), createProduct);
router.get("/", getProducts);

export default router;
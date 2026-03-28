import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { isAdmin } from "../middleware/auth.js";
import dotenv from "dotenv";

dotenv.config(); // Ensure .env keys are loaded

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Setup Storage Engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "lms_assets",
    resource_type: "auto", 
    public_id: (req, file) => `${Date.now()}-${file.originalname.split('.')[0]}`,
  },
});

const upload = multer({ storage });

/**
 * @route   POST /api/upload
 * @desc    Admin uploads file to Cloudinary
 * Note: Use "/" here because it is mounted as /api/upload in server.js
 */
router.post("/", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file provided or upload failed" });
    }
    
    // Cloudinary returns the URL in req.file.path
    res.status(200).json({ 
      url: req.file.path,
      message: "File uploaded successfully" 
    });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ message: "Internal Server Error during upload" });
  }
});

router.post("/delete", isAdmin, async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ message: "No URL provided" });
    }

    // 1. Extract the public_id from the Cloudinary URL
    // A typical URL looks like: https://res.cloudinary.com/demo/image/upload/v12345/lms_assets/filename.jpg
    // We need "lms_assets/filename"
    const parts = url.split("/");
    const fileNameWithExtension = parts.pop(); // e.g., "filename.jpg"
    const folderName = parts.pop(); // e.g., "lms_assets"
    const publicId = `${folderName}/${fileNameWithExtension.split(".")[0]}`;

    // 2. Delete from Cloudinary
    // Note: resource_type is 'auto' by default, but for PDFs/Docs use 'raw' or 'image'
    // Destroying with 'auto' usually works if the publicId is correct
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === "ok") {
      return res.status(200).json({ message: "File deleted from Cloudinary successfully" });
    } else {
      return res.status(404).json({ message: "File not found on Cloudinary", cloudResult: result });
    }
  } catch (err) {
    console.error("Cloudinary Delete Error:", err);
    res.status(500).json({ message: "Server error during Cloudinary cleanup" });
  }
});

// ... your existing router.post("/", upload.single("file")... code
export default router;
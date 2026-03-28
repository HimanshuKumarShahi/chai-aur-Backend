import express from "express";
import User from "../models/User.js";

const router = express.Router();

/**
 * @route   POST /api/user/sync
 * @desc    Sync Clerk user with MongoDB
 */
router.post("/sync", async (req, res) => {
  try {
    const { clerkId, email, name } = req.body;

    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({
        clerkId,
        email,
        name,
        role: "user" // Default role
      });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   GET /api/user/role/:clerkId
 * @desc    Get only the user's role (Crucial for Navbar)
 * @note    THIS MUST BE ABOVE THE GET /:clerkId ROUTE
 */
router.get("/role/:clerkId", async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.params.clerkId });
    
    if (!user) {
      return res.status(404).json({ role: "user" });
    }

    res.status(200).json({ role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   PUT /api/user/update/:clerkId
 * @desc    Update user profile name
 */
router.put("/update/:clerkId", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { clerkId: req.params.clerkId },
      { name: req.body.name },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   GET /api/user/:clerkId
 * @desc    Get full user profile
 */
router.get("/:clerkId", async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.params.clerkId });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
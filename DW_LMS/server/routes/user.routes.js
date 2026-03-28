import express from "express";
import User from "../models/User.js";
import { isAdmin } from "../middleware/auth.js"; // Import the admin check

const router = express.Router();

/**
 * @route   POST /api/user/sync
 * @desc    Sync Clerk user with MongoDB (Public)
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
        role: "user"
      });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   GET /api/user/all
 * @desc    Get all users for Admin Panel
 * @access  Admin Only
 */
router.get("/all", isAdmin, async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   GET /api/user/role/:clerkId
 * @desc    Get only the user's role (Used by Navbar/Admin button)
 */
router.get("/role/:clerkId", async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.params.clerkId });
    if (!user) return res.status(404).json({ role: "user" });
    res.status(200).json({ role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   PUT /api/user/block/:clerkId
 * @desc    Block or Unblock a user
 * @access  Admin Only
 */
router.put("/block/:clerkId", isAdmin, async (req, res) => {
  try {
    const { isBlocked } = req.body;
    const user = await User.findOneAndUpdate(
      { clerkId: req.params.clerkId },
      { $set: { isBlocked } },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   PUT /api/user/update/:clerkId
 * @desc    Update user profile (Self-service)
 */
router.put("/update/:clerkId", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { clerkId: req.params.clerkId },
      { $set: req.body }, 
      { new: true, runValidators: true }
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

/**
 * @route   DELETE /api/user/:clerkId
 * @desc    Permanently delete a user
 * @access  Admin Only
 */
router.delete("/:clerkId", isAdmin, async (req, res) => {
  try {
    const user = await User.findOneAndDelete({ clerkId: req.params.clerkId });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
import express from "express";
import User from "../models/User.js";
import { isAdmin } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route   POST /api/user/sync
 * @desc    Sync Clerk user with MongoDB (Creates if doesn't exist)
 */
router.post("/sync", async (req, res) => {
  try {
    const { clerkId, email, name } = req.body;

    // 1. STRICTOR VALIDATION
    // Since your Schema has 'required: true' for these, 
    // we must ensure they exist before calling MongoDB.
    if (!clerkId || !email || !name) {
      return res.status(400).json({ 
        message: "Missing required fields: clerkId, email, and name are all required." 
      });
    }

    // 2. ATOMIC UPSERT
    const user = await User.findOneAndUpdate(
      { clerkId },
      { 
        $set: { email, name }, 
        $setOnInsert: { role: "user", isBlocked: false } 
      },
      { 
        upsert: true, 
        returnDocument: 'after', 
        runValidators: true 
      }
    );

    console.log(`User synced: ${user.email}`);
    res.status(200).json(user);
  } catch (err) {
    console.error("Sync Error:", err.message);
    res.status(500).json({ message: "Internal Server Error during sync." });
  }
});

/**
 * @route   PUT /api/user/update/:clerkId
 * @desc    Update user profile (Self-service)
 */
router.put("/update/:clerkId", async (req, res) => {
  try {
    // 3. SECURITY: Strip sensitive fields from req.body
    // This prevents a user from sending { "role": "admin" } in the body
    const { role, clerkId, isBlocked, ...updateData } = req.body;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid update data provided." });
    }

    const user = await User.findOneAndUpdate(
      { clerkId: req.params.clerkId },
      { $set: updateData }, 
      { returnDocument: 'after', runValidators: true } 
    );
    
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   GET /api/user/role/:clerkId
 */
router.get("/role/:clerkId", async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.params.clerkId });
    // Default to 'user' if not found to avoid frontend crashes
    if (!user) return res.status(200).json({ role: "user" }); 
    res.status(200).json({ role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   GET /api/user/all (Admin Only)
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
 * @route   PUT /api/user/block/:clerkId (Admin Only)
 */
router.put("/block/:clerkId", isAdmin, async (req, res) => {
  try {
    const { isBlocked } = req.body;
    const user = await User.findOneAndUpdate(
      { clerkId: req.params.clerkId },
      { $set: { isBlocked } },
      { returnDocument: 'after' }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   GET /api/user/:clerkId
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
 * @route   DELETE /api/user/:clerkId (Admin Only)
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
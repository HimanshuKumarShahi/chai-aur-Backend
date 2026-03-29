import express from "express";
import User from "../models/User.js";
import { isAdmin, checkBlocked } from "../middleware/auth.js";
import { sendWelcomeEmail } from "../utils/sendEmail.js";

const router = express.Router();

// 🔄 SYNC: Detects if it's the user's first time or a returning login
router.post("/sync", async (req, res) => {
  try {
    const { clerkId, email, name } = req.body;

    if (!clerkId || !email) {
      return res.status(400).json({ message: "Identity credentials missing." });
    }

    // 1. Check if user exists
    let user = await User.findOne({ clerkId });
    let isNewUser = false;

    if (!user) {
      // 2. Initialize New Entry
      user = new User({
        clerkId,
        email,
        name: name || "Anonymous Scholar",
        role: "user",
        isBlocked: false,
      });

      await user.save();
      isNewUser = true;

      // 3. Trigger Async Welcome Email (Don't await to keep response fast)
      sendWelcomeEmail(email, user.name).catch(err => 
        console.error("Async Email Error:", err)
      );
    }

    // 4. Return Data to Frontend
    res.status(200).json({
      user,
      isNewUser, // Frontend uses this to trigger the Welcome Modal
    });

  } catch (err) {
    console.error("Sync Critical Error:", err.message);
    res.status(500).json({ message: "Mainframe synchronization failed." });
  }
});

// 📝 UPDATE: Blocked users are stopped by 'checkBlocked' middleware
router.put("/update/:clerkId", checkBlocked, async (req, res) => {
  try {
    // Security: Strip dangerous fields so users can't make themselves admin
    const { role, clerkId, isBlocked, ...updateData } = req.body; 

    const user = await User.findOneAndUpdate(
      { clerkId: req.params.clerkId },
      { $set: updateData }, 
      { returnDocument: 'after', runValidators: true } 
    );
    
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

// 🔑 ROLE CHECK: Used by Navbar to show/hide Admin Panel
router.get("/role/:clerkId", async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.params.clerkId });
    res.status(200).json({ 
      role: user?.role || "user", 
      isBlocked: user?.isBlocked || false 
    });
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

// 🛡️ ADMIN: Fetch all users for the Directory
router.get("/all", isAdmin, async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

// 🚫 ADMIN: Toggle Block status
router.put("/block/:clerkId", isAdmin, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { clerkId: req.params.clerkId },
      { $set: { isBlocked: req.body.isBlocked } },
      { returnDocument: 'after' }
    );
    res.status(200).json(user);
  } catch (err) { 
    res.status(500).json({ message: err.message }); 
  }
});

// 👤 GET SINGLE USER: For Profile Page
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
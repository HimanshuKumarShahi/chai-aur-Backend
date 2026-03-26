import express from "express";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Sync user after login
router.post("/sync", requireAuth, async (req, res) => {
  try {
    const { userId } = req.auth;

    // safer: get data from Clerk token if possible
    const email = req.body.email;
    const name = req.body.name;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      // create new user
      user = await User.create({
        clerkId: userId,
        email,
        name,
      });
    } else {
      // update existing user
      user.email = email;
      user.name = name;
      await user.save();
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
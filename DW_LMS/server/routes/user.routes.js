import express from "express";
import User from "../models/User.js";

const router = express.Router();


router.post("/sync", async (req, res) => {
  try {
    const { clerkId, email, name } = req.body;

    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({
        clerkId,
        email,
        name
      });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json(err.message);
  }
});


router.put("/update/:clerkId", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { clerkId: req.params.clerkId },
      { name: req.body.name },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get("/:clerkId", async (req, res) => {
  try {
    const user = await User.findOne({ clerkId: req.params.clerkId });

    if (!user) return res.status(404).json("User not found");

    res.json(user);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

export default router;
import express from "express";
import Download from "../models/Download.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const existing = await Download.findOne({ userId, courseId });

    if (existing) return res.json(existing);

    const download = await Download.create(req.body);

    res.json(download);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const data = await Download.find({ userId: req.params.userId });
    res.json(data);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

export default router;
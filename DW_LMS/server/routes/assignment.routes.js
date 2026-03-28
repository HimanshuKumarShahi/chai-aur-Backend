import express from "express";
import Assignment from "../models/Assignment.js";

const router = express.Router();

router.post("/create", async (req, res) => {
  try {
    const { title, courseId, fileUrl } = req.body;

    if (!title || !courseId) {
      return res.status(400).json("Missing fields");
    }

    const assignment = await Assignment.create({
      title,
      courseId,
      fileUrl
    });

    res.json(assignment);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

router.get("/:courseId", async (req, res) => {
  try {
    const data = await Assignment.find({ courseId: req.params.courseId });
    res.json(data);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

export default router;
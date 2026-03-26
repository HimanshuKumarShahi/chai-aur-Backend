import express from "express";
import Lesson from "../models/Lesson.js";
import { requireAuth } from "../middleware/auth.js";
import { requireAdmin } from "../middleware/admin.js";

const router = express.Router();

// ADD THIS NEW ROUTE: GET single lesson for the video player
router.get("/video/:id", async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET lessons by course
router.get("/:courseId", async (req, res) => {
  try {
    const lessons = await Lesson.find({
      course: req.params.courseId,
    });
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CREATE lesson (ADMIN ONLY)
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const lesson = new Lesson(req.body);
    await lesson.save();
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
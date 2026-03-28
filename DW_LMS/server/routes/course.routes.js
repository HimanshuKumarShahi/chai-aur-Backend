import express from "express";
import Course from "../models/Course.js";
import { isAdmin } from "../middleware/auth.js";

const router = express.Router();

/**
 * @route   POST /api/course/create
 * @desc    Create a new course with assignments/resources
 * @access  Admin Only
 */
router.post("/create", isAdmin, async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnail } = req.body;

    if (!title || !description || !videoUrl || !thumbnail) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // This will now include the assignments and resources arrays from req.body
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   GET /api/course
 * @desc    Get all courses for the catalog
 */
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   GET /api/course/:id
 * @desc    Get a single course detail
 */
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @route   PUT /api/course/:id
 * @desc    Update existing course (FIXES THE "CANNOT PUT" ERROR)
 * @access  Admin Only
 */
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCourse) {
      return res.status(404).json("Course not found");
    }

    res.json(updatedCourse);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

/**
 * @route   DELETE /api/course/:id
 * @desc    Delete a course permanently
 * @access  Admin Only
 */
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json("Course deleted");
  } catch (err) {
    res.status(500).json(err.message);
  }
});

export default router;
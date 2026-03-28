import express from "express";
import Course from "../models/Course.js";
import { isAdmin } from "../middleware/auth.js";

const router = express.Router();


router.post("/create", isAdmin, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json("Missing fields");
    }

    const course = await Course.create(req.body);
    res.json(course);

  } catch (err) {
    res.status(500).json(err.message);
  }
});


router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json(err.message);
  }
});


router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) return res.status(404).json("Course not found");

    res.json(course);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

export default router;
import Course from '../models/Course.js';
import cloudinary from '../config/cloudinary.js';

export const createCourse = async (req, res) => {
  try {
    let image = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      image = result.secure_url;
    }

    const course = await Course.create({
      title: req.body.title,
      description: req.body.description,
      instructor: req.body.instructor,
      price: req.body.price,
      thumbnail: image
    });

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getCourses = async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
};
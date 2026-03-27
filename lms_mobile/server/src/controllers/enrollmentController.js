import User from '../models/User.js';
import Course from '../models/Course.js';

export const enrollCourse = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { courseId } = req.body;

    const user = await User.findOne({ clerkId: userId });
    const course = await Course.findById(courseId);

    if (!user || !course) {
      return res.status(404).json({ message: "User or Course not found" });
    }

    if (user.enrolledCourses.includes(courseId)) {
      return res.json({ message: "Already enrolled" });
    }

    user.enrolledCourses.push(courseId);
    course.students.push(user._id);

    await user.save();
    await course.save();

    res.json({ message: "Enrolled successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
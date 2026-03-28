import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  videoUrl: String,
  thumbnail: String,
  instructor: String
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);
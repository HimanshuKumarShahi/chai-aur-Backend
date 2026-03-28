import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: String,
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },
  fileUrl: String
}, { timestamps: true });

export default mongoose.model("Assignment", assignmentSchema);
import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema({
  userId: String,
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  },
  fileUrl: String
}, { timestamps: true });

export default mongoose.model("Download", downloadSchema);
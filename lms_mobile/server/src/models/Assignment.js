import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  fileUrl: String, // Cloudinary URL
  fileType: { type: String, enum: ['pdf', 'video', 'image'] },
  isAdminOnly: { type: Boolean, default: false } // Only you can delete
}, { timestamps: true });

export default mongoose.model('Assignment', assignmentSchema);
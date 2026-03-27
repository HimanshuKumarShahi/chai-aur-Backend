import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: { type: String, unique: true },
  name: String,
  email: String,
  image: String,
  enrolledCourses: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }
  ]
}, { timestamps: true });

export default mongoose.model('User', userSchema);
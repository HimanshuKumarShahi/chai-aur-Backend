import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  videoUrl: { type: String, required: true },
  thumbnail: { type: String, required: true },
  instructor: { type: String, required: true },
  category: { type: String,  }, 
  
  
  assignments: [
    { 
      title: String, 
      fileUrl: String 
    }
  ],
  playlist: [
    { 
      title: String, 
      videoUrl: String 
    }
  ],
  
  resources: [
    { 
      title: String, 
      fileUrl: String 
    }
  ]
}, { timestamps: true });

export default mongoose.model("Course", courseSchema);
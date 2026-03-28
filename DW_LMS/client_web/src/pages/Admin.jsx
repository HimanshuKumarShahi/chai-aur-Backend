import { useState } from "react";
import axios from "axios";

export default function Admin() {
  const [course, setCourse] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnail: "",
    instructor: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Note: Ensure your backend /api/course/create route is protected by isAdmin middleware
      await axios.post(`${import.meta.env.VITE_API_URL}/api/course/create`, course);
      alert("Course created successfully!");
      setCourse({ title: "", description: "", videoUrl: "", thumbnail: "", instructor: "" });
    } catch (err) {
      alert("Error creating course: " + (err.response?.data || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-black text-orange-500 mb-8 uppercase tracking-tighter">Admin Dashboard</h1>
        
        <form onSubmit={handleSubmit} className="bg-gray-900/50 border border-gray-800 p-8 rounded-3xl space-y-6">
          <h2 className="text-xl font-bold border-b border-gray-800 pb-4">Add New Course</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Course Title</label>
              <input 
                type="text" 
                className="w-full bg-black border border-gray-700 p-3 rounded-xl focus:border-orange-500 outline-none transition"
                value={course.title} onChange={(e) => setCourse({...course, title: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Instructor Name</label>
              <input 
                type="text" 
                className="w-full bg-black border border-gray-700 p-3 rounded-xl focus:border-orange-500 outline-none transition"
                value={course.instructor} onChange={(e) => setCourse({...course, instructor: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-400">Description</label>
            <textarea 
              className="w-full bg-black border border-gray-700 p-3 rounded-xl focus:border-orange-500 outline-none transition h-32"
              value={course.description} onChange={(e) => setCourse({...course, description: e.target.value})}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-400">YouTube URL</label>
              <input 
                type="text" 
                placeholder="https://youtube.com/watch?v=..."
                className="w-full bg-black border border-gray-700 p-3 rounded-xl focus:border-orange-500 outline-none transition"
                value={course.videoUrl} onChange={(e) => setCourse({...course, videoUrl: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-400">Thumbnail Image URL</label>
              <input 
                type="text" 
                className="w-full bg-black border border-gray-700 p-3 rounded-xl focus:border-orange-500 outline-none transition"
                value={course.thumbnail} onChange={(e) => setCourse({...course, thumbnail: e.target.value})}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-orange-500 text-black font-black py-4 rounded-xl hover:bg-orange-400 transition-all disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Create Course"}
          </button>
        </form>
      </div>
    </div>
  );
}
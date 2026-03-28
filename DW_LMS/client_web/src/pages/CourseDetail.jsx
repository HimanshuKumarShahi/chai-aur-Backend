import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CourseDetail() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Robust YouTube embed fix with branding and control parameters
  const getEmbedUrl = (url) => {
    if (!url) return "";
    
    let videoId = "";
    if (url.includes("watch?v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("embed/")) {
      videoId = url.split("embed/")[1].split("?")[0];
    }

    if (videoId) {
      /**
       * modestbranding=1: Hides the YouTube logo in the control bar.
       * rel=0: Shows related videos from the same channel only.
       * controls=1: Ensures the video player controls are visible.
       * iv_load_policy=3: Hides video annotations.
       */
      return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&controls=1&iv_load_policy=3&showinfo=0`;
    }

    return url; 
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/course/${id}`
        );
        setCourse(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Loading Lessons...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="bg-black min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">404</h2>
        <p className="text-gray-400 mb-8">Course not found.</p>
        <Link to="/courses" className="bg-orange-500 text-black px-8 py-3 rounded-full font-bold transition hover:bg-orange-400">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen pb-20 selection:bg-orange-500/30">
      
      {/* 🎬 Main Video Header Area */}
      <div className="bg-gray-900/20 border-b border-gray-800 pt-10 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            
            {/* Left Column: The Player */}
            <div className="w-full lg:w-2/3">
              <div className="relative group rounded-2xl overflow-hidden border border-gray-800 bg-black shadow-2xl shadow-orange-500/5 transition-all hover:border-orange-500/30">
                <div className="aspect-video w-full">
                  <iframe
                    className="w-full h-full"
                    src={getEmbedUrl(course.videoUrl)}
                    title="course video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Quick Stats */}
            <div className="w-full lg:w-1/3 space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest">
                Now Playing
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
                {course.title}
              </h1>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-black font-bold">
                  {course.instructor?.charAt(0) || "D"}
                </div>
                <div>
                  <p className="text-sm text-gray-400 font-medium tracking-wide uppercase">Instructor</p>
                  <p className="text-white font-bold">{course.instructor || "DW Specialist"}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 📚 Bottom Content Area */}
      <div className="max-w-6xl mx-auto px-6 mt-12">
        <div className="grid lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-orange-500 rounded-full"></span>
              About this course
            </h3>
            <p className="text-gray-400 leading-relaxed text-lg whitespace-pre-line">
              {course.description}
            </p>
          </div>

          {/* Sidebar Tools */}
          <div className="space-y-6">
            <div className="bg-gray-900/40 p-6 rounded-2xl border border-gray-800">
              <h4 className="font-bold text-orange-400 mb-4 uppercase text-xs tracking-widest">Course Materials</h4>
              <div className="space-y-3">
                <Link to="/assignments" className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-gray-800 hover:border-orange-500/50 transition-all group">
                  <span className="text-sm group-hover:text-orange-400 transition-colors">📝 View Assignments</span>
                  <span className="text-gray-600">→</span>
                </Link>
                <Link to="/downloads" className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-gray-800 hover:border-orange-500/50 transition-all group">
                  <span className="text-sm group-hover:text-orange-400 transition-colors">💾 Download Resources</span>
                  <span className="text-gray-600">→</span>
                </Link>
              </div>
            </div>

            <div className="p-6 rounded-2xl border border-gray-800 bg-gradient-to-br from-orange-500/5 to-transparent">
              <p className="text-sm text-gray-400 italic">
                "Apply what you learn here to real-world projects to build your portfolio."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
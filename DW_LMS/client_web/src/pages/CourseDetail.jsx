import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

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
    return videoId ? `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&controls=1` : url;
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/course/${id}`);
        setCourse(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-black text-white min-h-screen pb-20 selection:bg-orange-500/30">
      
      {/* 🎬 Large Cinematic Header */}
      <div className="bg-gray-900/40 border-b border-gray-800 pt-12 pb-20">
        <div className="max-w-[1440px] mx-auto px-6 xl:px-12">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            
            {/* Video Player */}
            <div className="w-full lg:w-[72%]">
              <div className="relative rounded-3xl overflow-hidden border border-gray-800 bg-black shadow-2xl">
                <div className="aspect-video w-full">
                  <iframe
                    className="w-full h-full"
                    src={getEmbedUrl(course?.videoUrl)}
                    title="course video"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="w-full lg:w-[28%] space-y-6">
              <div className="inline-block px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-[10px] font-black uppercase tracking-widest">
                Now Playing
              </div>
              <h1 className="text-4xl font-black italic tracking-tighter">{course?.title}</h1>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-black font-black text-xl">
                  {course?.instructor?.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Instructor</p>
                  <p className="text-white font-black">{course?.instructor}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📚 Bottom Content & Materials */}
      <div className="max-w-[1440px] mx-auto px-6 xl:px-12 mt-16">
        <div className="grid lg:grid-cols-3 gap-16">
          
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-black mb-6 text-orange-500 uppercase tracking-widest italic">Course Info</h3>
            <div className="bg-gray-900/20 border border-gray-800 p-8 rounded-[2rem]">
              <p className="text-gray-400 leading-relaxed text-lg whitespace-pre-line">{course?.description}</p>
            </div>
          </div>

          <div className="space-y-8">
            {/* 📝 Assignments Sidebar Section */}
            <div className="bg-gray-900/40 p-8 rounded-[2.5rem] border border-gray-800">
              <h4 className="font-black text-orange-400 mb-6 uppercase text-xs tracking-widest">Assignments</h4>
              <div className="space-y-3">
                {course?.assignments?.length > 0 ? course.assignments.map((a, idx) => (
                  <a key={idx} href={a.fileUrl} target="_blank" className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-gray-800 hover:border-orange-500/50 transition-all group">
                    <span className="text-sm font-bold group-hover:text-orange-400">📝 {a.title}</span>
                    <span className="text-gray-600">→</span>
                  </a>
                )) : <p className="text-gray-600 text-sm italic">No assignments yet.</p>}
              </div>
            </div>

            {/* 💾 Resources Sidebar Section */}
            <div className="bg-gray-900/40 p-8 rounded-[2.5rem] border border-gray-800">
              <h4 className="font-black text-white mb-6 uppercase text-xs tracking-widest">Downloads</h4>
              <div className="space-y-3">
                {course?.resources?.length > 0 ? course.resources.map((r, idx) => (
                  <a key={idx} href={r.fileUrl} download className="flex items-center justify-between p-4 bg-black/40 rounded-2xl border border-gray-800 hover:border-orange-500/50 transition-all group">
                    <span className="text-sm font-bold group-hover:text-orange-400">💾 {r.title}</span>
                    <span className="text-gray-600">↓</span>
                  </a>
                )) : <p className="text-gray-600 text-sm italic">No resources available.</p>}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
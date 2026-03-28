import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 🔥 New state to track which video is currently playing
  const [currentVideo, setCurrentVideo] = useState("");
  const [activeLessonIdx, setActiveLessonIdx] = useState(-1); // -1 means Intro Video

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
    return videoId ? `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&autoplay=1` : url;
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/course/${id}`);
        setCourse(res.data);
        // Set the initial video to the main Course Preview video
        setCurrentVideo(res.data.videoUrl);
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
      
      {/* 🎬 Cinematic Theater Section */}
      <div className="bg-gray-900/40 border-b border-gray-800 pt-8 pb-12">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* 1. Main Video Player (Left Side) */}
            <div className="w-full lg:w-[70%]">
              <div className="relative rounded-[2rem] overflow-hidden border border-gray-800 bg-black shadow-2xl group">
                <div className="aspect-video w-full">
                  <iframe
                    className="w-full h-full"
                    src={getEmbedUrl(currentVideo)}
                    title="course video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-black italic tracking-tighter text-white">
                    {activeLessonIdx === -1 ? "Course Introduction" : course?.playlist[activeLessonIdx]?.title}
                  </h1>
                  <p className="text-orange-500 font-bold text-sm uppercase tracking-widest mt-1">{course?.title}</p>
                </div>
                <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/10 hidden md:block">
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Instructor</p>
                  <p className="text-white text-sm font-black">{course?.instructor}</p>
                </div>
              </div>
            </div>

            {/* 2. 🔥 CURRICULUM PLAYLIST (Right Side Sidebar) */}
            <div className="w-full lg:w-[30%] flex flex-col h-[500px] lg:h-auto">
              <div className="bg-gray-900/60 border border-gray-800 rounded-[2rem] flex flex-col h-full overflow-hidden">
                <div className="p-6 border-b border-gray-800 bg-gray-900/80">
                  <h2 className="text-lg font-black uppercase italic tracking-tighter">Course Curriculum</h2>
                  <p className="text-xs text-gray-500 font-bold">{course?.playlist?.length || 0} Lessons Available</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                  {/* --- Intro Video Button --- */}
                  <button 
                    onClick={() => { setCurrentVideo(course.videoUrl); setActiveLessonIdx(-1); }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                      activeLessonIdx === -1 
                      ? "bg-orange-500 border-orange-500 text-black shadow-lg shadow-orange-500/20" 
                      : "bg-black/40 border-gray-800 text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    <span className="text-lg">🎬</span>
                    <div className="flex-1">
                      <p className="text-[10px] font-black uppercase opacity-60">Start Here</p>
                      <p className="text-sm font-bold truncate">Course Introduction</p>
                    </div>
                  </button>

                  {/* --- Playlist Lessons --- */}
                  {course?.playlist?.map((lesson, idx) => (
                    <button 
                      key={idx}
                      onClick={() => { setCurrentVideo(lesson.videoUrl); setActiveLessonIdx(idx); }}
                      className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 ${
                        activeLessonIdx === idx 
                        ? "bg-orange-500 border-orange-500 text-black shadow-lg" 
                        : "bg-black/40 border-gray-800 text-gray-400 hover:border-gray-600"
                      }`}
                    >
                      <span className={`text-xs font-black ${activeLessonIdx === idx ? "text-black" : "text-gray-600"}`}>
                        {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black uppercase opacity-60">Lesson</p>
                        <p className="text-sm font-bold truncate">{lesson.title}</p>
                      </div>
                      {activeLessonIdx === idx && <span className="animate-pulse text-xs">●</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 📚 Bottom Content: Info, Assignments, Downloads */}
      <div className="max-w-[1600px] mx-auto px-6 mt-16">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* About Course */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-900/20 border border-gray-800 p-10 rounded-[3rem]">
              <h3 className="text-2xl font-black mb-6 text-orange-500 uppercase tracking-tighter italic">About this course</h3>
              <p className="text-gray-400 leading-relaxed text-lg whitespace-pre-line">
                {course?.description}
              </p>
            </div>
          </div>

          {/* Materials Sidebar */}
          <div className="space-y-6">
            <section className="bg-gray-900/40 p-8 rounded-[2.5rem] border border-gray-800">
              <h4 className="font-black text-orange-400 mb-6 uppercase text-xs tracking-widest flex items-center gap-2">
                <span>📝</span> Course Tasks
              </h4>
              <div className="space-y-3">
                {course?.assignments?.length > 0 ? course.assignments.map((a, i) => (
                  <a key={i} href={a.fileUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-black/60 rounded-2xl border border-gray-800 hover:border-orange-500/50 transition-all group">
                    <span className="text-sm font-bold group-hover:text-orange-400 truncate pr-4">{a.title}</span>
                    <span className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                  </a>
                )) : <p className="text-gray-600 text-xs italic text-center">No assignments provided.</p>}
              </div>
            </section>

            <section className="bg-gray-900/40 p-8 rounded-[2.5rem] border border-gray-800">
              <h4 className="font-black text-white mb-6 uppercase text-xs tracking-widest flex items-center gap-2">
                <span>💾</span> Source Materials
              </h4>
              <div className="space-y-3">
                {course?.resources?.length > 0 ? course.resources.map((r, i) => (
                  <a key={i} href={r.fileUrl} download className="flex items-center justify-between p-4 bg-black/60 rounded-2xl border border-gray-800 hover:border-white transition-all group">
                    <span className="text-sm font-bold truncate pr-4">{r.title}</span>
                    <span className="text-gray-600">↓</span>
                  </a>
                )) : <p className="text-gray-600 text-xs italic text-center">No resources to download.</p>}
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
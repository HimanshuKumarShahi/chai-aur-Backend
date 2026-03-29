import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Play, 
  FileText, 
  Download, 
  User, 
  BookOpen, 
  ArrowUpRight, 
  LayoutList,
  ChevronRight,
  ShieldCheck,
  Zap,
  Clock
} from "lucide-react";

export default function CourseDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState("");
  const [activeLessonIdx, setActiveLessonIdx] = useState(-1);

  // Premium Ads-Free & Autoplay Configuration
  const getEmbedUrl = (url, shouldAutoplay) => {
    if (!url) return "";
    let videoId = "";
    if (url.includes("watch?v=")) videoId = url.split("v=")[1].split("&")[0];
    else if (url.includes("youtu.be/")) videoId = url.split("youtu.be/")[1].split("?")[0];
    else if (url.includes("embed/")) videoId = url.split("embed/")[1].split("?")[0];
    
    // modestbranding=1 removes logo, rel=0 removes related videos, iv_load_policy=3 removes annotations
    const params = `?autoplay=${shouldAutoplay ? 1 : 0}&modestbranding=1&rel=0&iv_load_policy=3&showinfo=0&color=white&controls=1&enablejsapi=1`;
    return videoId ? `https://www.youtube.com/embed/${videoId}${params}` : url;
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/course/${id}`);
        setCourse(res.data);
        setCurrentVideo(res.data.videoUrl);
      } catch (err) {
        console.error("Fetch Course Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  if (loading) return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-[#050505] text-white min-h-screen selection:bg-orange-500/30 pb-20">
      
      {/* 🎬 THEATER SECTION */}
      <section className="md:pt-10 pb-8 bg-gradient-to-b from-[#0A0A0A] to-[#050505]">
        <div className="max-w-[1750px] mx-auto px-0 md:px-6 lg:px-10">
          <div className="flex flex-col xl:flex-row gap-6 md:gap-10">
            
            {/* 1. Main Player Wrapper */}
            <div className="flex-1 min-w-0">
              <div className="relative group md:rounded-[2rem] overflow-hidden border-y md:border border-white/5 bg-black aspect-video shadow-2xl">
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={getEmbedUrl(currentVideo, location.state?.autoStart || activeLessonIdx !== -1)}
                  title="course video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              
              <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-6 px-5 md:px-2">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 bg-orange-500/10 text-orange-500 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider border border-orange-500/20">
                      <ShieldCheck size={12} /> Ads Free Environment
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/5 text-gray-400 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-white/5">
                      <Clock size={12} /> {course?.duration || "Self-Paced"}
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter leading-[1.1] italic">
                    {activeLessonIdx === -1 ? "Course Briefing" : course?.playlist[activeLessonIdx]?.title}
                  </h1>
                </div>

                <div className="flex items-center gap-4 bg-white/[0.03] border border-white/5 p-4 rounded-2xl backdrop-blur-sm shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center text-black font-bold text-lg">
                    {course?.instructor?.charAt(0) || <User size={20} />}
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Instructor</p>
                    <p className="text-sm font-bold">{course?.instructor || "Lead Architect"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. CURRICULUM SIDEBAR */}
            <div className="w-full xl:w-[420px] px-5 md:px-0">
              <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden flex flex-col h-[480px] md:h-[500px] xl:h-[calc(100vh-220px)] sticky top-10">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                  <div className="flex items-center gap-2">
                    <LayoutList size={16} className="text-orange-500" />
                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Syllabus</h2>
                  </div>
                  <span className="text-[10px] font-bold text-gray-600 bg-white/5 px-2 py-1 rounded">{course?.playlist?.length || 0} Modules</span>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                  <button 
                    onClick={() => { setCurrentVideo(course.videoUrl); setActiveLessonIdx(-1); }}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 group ${
                      activeLessonIdx === -1 
                      ? "bg-white text-black border-white shadow-lg" 
                      : "bg-transparent border-transparent text-gray-500 hover:bg-white/5"
                    }`}
                  >
                    <Play size={14} fill={activeLessonIdx === -1 ? "black" : "none"} />
                    <span className="text-sm font-bold tracking-tight uppercase">00. Introduction</span>
                  </button>

                  {course?.playlist?.map((lesson, idx) => (
                    <button 
                      key={idx}
                      onClick={() => { setCurrentVideo(lesson.videoUrl); setActiveLessonIdx(idx); }}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-4 group ${
                        activeLessonIdx === idx 
                        ? "bg-orange-500 text-black border-orange-500 shadow-lg shadow-orange-500/10" 
                        : "bg-transparent border-transparent text-gray-500 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className={`text-[10px] font-black w-6 h-6 rounded flex items-center justify-center border ${activeLessonIdx === idx ? "border-black/20 bg-black/10" : "border-white/10"}`}>
                        {(idx + 1).toString().padStart(2, '0')}
                      </div>
                      <p className="text-sm font-bold tracking-tight truncate flex-1">{lesson.title}</p>
                      {activeLessonIdx === idx && <ChevronRight size={16} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 📚 INFO & RESOURCES SECTION */}
      <section className="max-w-[1750px] mx-auto px-5 md:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Main Description */}
          <div className="lg:col-span-8">
            <div className="bg-white/[0.02] border border-white/5 p-8 md:p-14 rounded-[2.5rem] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 blur-[100px] rounded-full"></div>
              <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-tighter italic">Deep Dive</h3>
              </div>
              <p className="text-gray-400 leading-relaxed text-lg whitespace-pre-line font-medium opacity-90 italic">
                {course?.description || "No description provided for this module."}
              </p>
            </div>
          </div>

          {/* Sidebar Resources */}
          <div className="lg:col-span-4 space-y-6">
            {/* Task Section */}
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem]">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 mb-6 flex items-center gap-2">
                <Zap size={14} /> Mission Tasks
              </h4>
              <div className="space-y-3">
                {course?.assignments?.length > 0 ? course.assignments.map((a, i) => (
                  <a key={i} href={a.fileUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 hover:border-orange-500/50 transition-all group">
                    <span className="text-xs font-bold text-gray-300 truncate pr-4">{a.title}</span>
                    <ArrowUpRight size={14} className="text-gray-600 group-hover:text-orange-500 shrink-0" />
                  </a>
                )) : (
                  <div className="py-8 text-center border border-dashed border-white/5 rounded-xl">
                    <p className="text-gray-700 text-[10px] font-bold uppercase tracking-widest">No Tasks Assigned</p>
                  </div>
                )}
              </div>
            </div>

            {/* Assets Section */}
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem]">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-6 flex items-center gap-2">
                <Download size={14} /> Knowledge Vault
              </h4>
              <div className="space-y-3">
                {course?.resources?.length > 0 ? course.resources.map((r, i) => (
                  <a key={i} href={r.fileUrl} download className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 hover:border-white/40 transition-all group">
                    <span className="text-xs font-bold text-gray-400 truncate pr-4">{r.title}</span>
                    <Download size={14} className="text-gray-600 group-hover:text-white shrink-0" />
                  </a>
                )) : (
                  <div className="py-8 text-center border border-dashed border-white/5 rounded-xl">
                    <p className="text-gray-700 text-[10px] font-bold uppercase tracking-widest">Empty Vault</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Footer Branding */}
      <footer className="max-w-[1750px] mx-auto px-10 py-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
        <p className="text-[10px] font-black uppercase tracking-[0.5em]">Digital Frontier © 2026</p>
        <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
           <span>Terms</span>
           <span>Privacy</span>
           <span>Support</span>
        </div>
      </footer>

      {/* Global Scrollbar Style */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #f97316; }
      `}</style>
    </div>
  );
}
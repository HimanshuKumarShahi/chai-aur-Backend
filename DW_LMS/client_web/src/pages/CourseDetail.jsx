import { useParams } from "react-router-dom";
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
  ChevronRight
} from "lucide-react";

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState("");
  const [activeLessonIdx, setActiveLessonIdx] = useState(-1);

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
    return videoId ? `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&autoplay=1&showinfo=0` : url;
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/course/${id}`);
        setCourse(res.data);
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
    <div className="bg-black min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-[#050505] text-white min-h-screen pb-20 selection:bg-orange-500/30">
      
      {/* 🎬 THEATER SECTION - Increased size and responsive padding */}
      <div className="bg-[#0A0A0A] border-b border-gray-900 pt-4 md:pt-10 pb-8 md:pb-16">
        <div className="max-w-[1800px] mx-auto px-0 md:px-6">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
            
            {/* 1. Main Video Player - Expanded to 75% for larger viewing */}
            <div className="w-full lg:w-[75%] px-4 md:px-0">
              <div className="relative rounded-xl md:rounded-[2.5rem] overflow-hidden border border-gray-800 bg-black shadow-2xl shadow-orange-500/5">
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
              
              <div className="mt-6 md:mt-8 px-2 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="bg-orange-500 text-black px-2 py-0.5 rounded text-[9px] font-black uppercase">
                        {activeLessonIdx === -1 ? "Intro" : `Lesson ${activeLessonIdx + 1}`}
                    </span>
                    <p className="text-orange-500 font-bold text-xs uppercase tracking-widest">{course?.title}</p>
                  </div>
                  <h1 className="text-2xl md:text-4xl font-black italic tracking-tighter text-white leading-tight">
                    {activeLessonIdx === -1 ? "Course Introduction" : course?.playlist[activeLessonIdx]?.title}
                  </h1>
                </div>

                <div className="flex items-center gap-3 bg-gray-900/40 p-3 md:p-4 rounded-2xl border border-gray-800 w-full md:w-auto">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500">
                    <User size={18} />
                  </div>
                  <div>
                    <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest leading-none mb-1">Instructor</p>
                    <p className="text-white text-xs md:text-sm font-bold truncate">{course?.instructor}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. CURRICULUM SIDEBAR - Fixed width on desktop, full on mobile */}
            <div className="w-full lg:w-[25%] px-4 md:px-0">
              <div className="bg-[#0D0D0D] border border-gray-800 rounded-3xl md:rounded-[2.5rem] flex flex-col h-[400px] lg:h-[calc(75vw*0.5625/1.33)] lg:min-h-[500px] overflow-hidden">
                <div className="p-5 border-b border-gray-800 bg-gray-900/20 flex justify-between items-center">
                    <h2 className="text-xs font-black uppercase tracking-widest italic text-gray-400 flex items-center gap-2">
                      <LayoutList size={14} className="text-orange-500" /> Curriculum
                    </h2>
                    <span className="text-[10px] text-gray-600 font-bold">{course?.playlist?.length || 0} Modules</span>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                  {/* Intro Video */}
                  <button 
                    onClick={() => { setCurrentVideo(course.videoUrl); setActiveLessonIdx(-1); }}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 group ${
                      activeLessonIdx === -1 
                      ? "bg-white text-black border-white" 
                      : "bg-black/40 border-gray-800 text-gray-400 hover:border-gray-700"
                    }`}
                  >
                    <Play size={14} fill={activeLessonIdx === -1 ? "black" : "transparent"} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black tracking-tight truncate uppercase">Course Intro</p>
                    </div>
                  </button>

                  {/* Playlist */}
                  {course?.playlist?.map((lesson, idx) => (
                    <button 
                      key={idx}
                      onClick={() => { setCurrentVideo(lesson.videoUrl); setActiveLessonIdx(idx); }}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3 group ${
                        activeLessonIdx === idx 
                        ? "bg-orange-500 text-black border-orange-500" 
                        : "bg-black/40 border-gray-800 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      <div className={`text-[10px] font-black w-6 h-6 rounded flex items-center justify-center border ${activeLessonIdx === idx ? "border-black/20 bg-black/10" : "border-gray-800"}`}>
                        {idx + 1}
                      </div>
                      <p className="text-xs font-black tracking-tight truncate flex-1">{lesson.title}</p>
                      {activeLessonIdx === idx && <ChevronRight size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 📚 BOTTOM CONTENT - Fixed spacing for mobile */}
      <div className="max-w-[1800px] mx-auto px-6 mt-12 md:mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-[#0D0D0D] border border-gray-900 p-6 md:p-10 rounded-3xl md:rounded-[3rem]">
              <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-orange-500/10 rounded-xl text-orange-500">
                    <BookOpen size={20} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter italic">About this course</h3>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm md:text-lg whitespace-pre-line font-medium italic">
                {course?.description}
              </p>
            </div>
          </div>

          {/* Resources Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <section className="bg-gray-900/20 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-gray-900">
              <h4 className="font-black text-orange-500 mb-6 uppercase text-[10px] tracking-widest flex items-center gap-3">
                <FileText size={16} /> Course Tasks
              </h4>
              <div className="space-y-3">
                {course?.assignments?.length > 0 ? course.assignments.map((a, i) => (
                  <a key={i} href={a.fileUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded-xl border border-gray-800 hover:border-orange-500/40 transition-all group">
                    <span className="text-xs font-bold text-gray-100 truncate pr-4">{a.title}</span>
                    <ArrowUpRight size={14} className="text-gray-700 group-hover:text-orange-500" />
                  </a>
                )) : <p className="text-gray-700 text-[10px] italic text-center">No tasks assigned.</p>}
              </div>
            </section>

            <section className="bg-gray-900/20 p-6 md:p-8 rounded-3xl md:rounded-[2.5rem] border border-gray-900">
              <h4 className="font-black text-white/50 mb-6 uppercase text-[10px] tracking-widest flex items-center gap-3">
                <Download size={16} /> Vault Materials
              </h4>
              <div className="space-y-3">
                {course?.resources?.length > 0 ? course.resources.map((r, i) => (
                  <a key={i} href={r.fileUrl} download className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded-xl border border-gray-800 hover:border-white/40 transition-all group">
                    <span className="text-xs font-bold text-gray-300 truncate pr-4">{r.title}</span>
                    <Download size={14} className="text-gray-700 group-hover:text-white" />
                  </a>
                )) : <p className="text-gray-700 text-[10px] italic text-center">No resources.</p>}
              </div>
            </section>
          </div>

        </div>
      </div>
    </div>
  );
}
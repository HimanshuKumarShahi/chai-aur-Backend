import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  LayoutList,
  ChevronRight,
  BookOpen,
  Zap,
  Download,
  User,
  Clock,
} from "lucide-react";

export default function CourseDetail() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentVideo, setCurrentVideo] = useState("");
  const [activeLessonIdx, setActiveLessonIdx] = useState(-1);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [showPlayer, setShowPlayer] = useState(false);

  // 🔥 EMBED URL
  const getEmbedUrl = (url) => {
    if (!url) return "";
    let id = "";

    if (url.includes("watch?v=")) id = url.split("v=")[1].split("&")[0];
    else if (url.includes("youtu.be/")) id = url.split("youtu.be/")[1].split("?")[0];
    else if (url.includes("embed/")) id = url.split("embed/")[1].split("?")[0];

    return `https://www.youtube.com/embed/${id}?autoplay=${hasInteracted ? 1 : 0}&mute=${hasInteracted ? 0 : 1}&rel=0&modestbranding=1&playsinline=1`;
  };

  const getThumbnail = (url) => {
    if (!url) return "";
    let id = "";

    if (url.includes("watch?v=")) id = url.split("v=")[1].split("&")[0];
    else if (url.includes("youtu.be/")) id = url.split("youtu.be/")[1].split("?")[0];
    else if (url.includes("embed/")) id = url.split("embed/")[1].split("?")[0];

    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
  };

  // 📡 FETCH
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* 🔥 TOP SECTION */}
      <div className="max-w-[1700px] mx-auto px-4 md:px-10 py-8 flex flex-col xl:flex-row gap-8">

        {/* 🎥 PLAYER */}
        <div className="flex-1 space-y-5">

          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/5 shadow-xl">

            {!showPlayer ? (
              <div
                onClick={() => {
                  setShowPlayer(true);
                  setHasInteracted(true);
                }}
                className="w-full h-full cursor-pointer relative flex items-center justify-center"
              >
                <img
                  src={getThumbnail(currentVideo)}
                  className="absolute w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = getThumbnail(currentVideo).replace("maxresdefault", "hqdefault");
                  }}
                />

                <div className="absolute inset-0 bg-black/40" />

                <div className="z-10 px-6 py-3 bg-white text-black rounded-full font-semibold hover:scale-105 transition">
                  ▶ Play Course
                </div>
              </div>
            ) : (
              <iframe
                key={currentVideo + hasInteracted}
                src={getEmbedUrl(currentVideo)}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            )}
          </div>

          {/* TITLE */}
          <div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
              {activeLessonIdx === -1
                ? course?.title
                : course?.playlist[activeLessonIdx]?.title}
            </h1>

            <div className="flex items-center gap-4 mt-3 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-black font-bold">
                  {course?.instructor?.charAt(0) || <User size={16} />}
                </div>
                {course?.instructor}
              </div>

              <div className="flex items-center gap-1">
                <Clock size={14} /> {course?.duration || "Self paced"}
              </div>
            </div>
          </div>
        </div>

        {/* 📚 SIDEBAR */}
        <div className="w-full xl:w-[380px] bg-[#0f0f0f] rounded-2xl border border-white/5 flex flex-col">

          <div className="p-4 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <LayoutList size={16} />
              <span className="text-sm font-semibold">Syllabus</span>
            </div>
            <span className="text-xs text-gray-500">
              {course?.playlist?.length + 1}
            </span>
          </div>

          <div className="p-3 space-y-2 max-h-[500px] overflow-y-auto">

            {[{ title: "Introduction", videoUrl: course.videoUrl }, ...(course?.playlist || [])]
              .map((lesson, idx) => {
                const isIntro = idx === 0;
                const active = activeLessonIdx === (isIntro ? -1 : idx - 1);

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setHasInteracted(true);
                      setShowPlayer(true);
                      setCurrentVideo(lesson.videoUrl);
                      setActiveLessonIdx(isIntro ? -1 : idx - 1);
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                      active
                        ? "bg-orange-500 text-black border-orange-500"
                        : "border-transparent text-gray-400 hover:bg-white/5"
                    }`}
                  >
                    <div className="w-10 h-10 flex items-center justify-center bg-black/50 rounded text-xs font-bold">
                      {idx.toString().padStart(2, "0")}
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-semibold line-clamp-1">
                        {lesson.title}
                      </p>
                      <p className="text-xs opacity-70">
                        {isIntro ? "Start here" : "Lesson"}
                      </p>
                    </div>

                    {active && <ChevronRight size={16} />}
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* 📖 DESCRIPTION */}
      <div className="max-w-[1200px] mx-auto px-4 mt-10">
        <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] p-8 rounded-3xl border border-white/10">
          <div className="flex items-center gap-3 mb-6 text-orange-500">
            <BookOpen size={20} />
            <h2 className="text-xl font-bold">Course Overview</h2>
          </div>

          <p className="text-gray-400 leading-relaxed">
            {course?.description}
          </p>
        </div>
      </div>

      {/* ⚡ ASSIGNMENTS */}
      <div className="max-w-[1200px] mx-auto px-4 mt-8">
        <div className="bg-[#0f0f0f] p-6 rounded-3xl border border-white/5">
          <h3 className="mb-5 flex items-center gap-2 text-orange-500 font-semibold">
            <Zap size={18} /> Assignments
          </h3>

          <div className="space-y-3">
            {course?.assignments?.length > 0 ? (
              course.assignments.map((a, i) => (
                <a
                  key={i}
                  href={a.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex justify-between items-center p-4 rounded-xl bg-black/40 border border-white/5 hover:border-orange-500/40 transition"
                >
                  <span>{a.title}</span>
                  <ChevronRight size={16} />
                </a>
              ))
            ) : (
              <p className="text-gray-500 text-center py-6">
                No assignments
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 📥 RESOURCES */}
      <div className="max-w-[1200px] mx-auto px-4 mt-8 pb-16">
        <div className="bg-[#0f0f0f] p-6 rounded-3xl border border-white/5">
          <h3 className="mb-5 flex items-center gap-2 text-gray-300 font-semibold">
            <Download size={18} /> Resources
          </h3>

          <div className="space-y-3">
            {course?.resources?.length > 0 ? (
              course.resources.map((r, i) => (
                <a
                  key={i}
                  href={r.fileUrl}
                  download
                  className="flex justify-between items-center p-4 rounded-xl bg-black/40 border border-white/5 hover:border-white/30 transition"
                >
                  <span>{r.title}</span>
                  <Download size={16} />
                </a>
              ))
            ) : (
              <p className="text-gray-500 text-center py-6">
                No resources
              </p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
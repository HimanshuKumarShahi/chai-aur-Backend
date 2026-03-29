import { useNavigate } from "react-router-dom";
import { Play, ArrowUpRight, ShieldCheck } from "lucide-react";

export default function CourseCard({ course }) {
  const navigate = useNavigate();

  const handleNavigation = () => {
    navigate(`/course/${course._id}`, { state: { autoStart: true } });
  };

  return (
    <div
      onClick={handleNavigation}
      className="group relative cursor-pointer"
    >
      {/* 🔥 Glow Effect */}
      <div className="absolute inset-0 rounded-3xl bg-orange-500/0 group-hover:bg-orange-500/10 blur-2xl transition-all duration-500" />

      {/* 🔲 CARD */}
      <div className="relative bg-[#0A0A0A] border border-white/5 rounded-3xl overflow-hidden transition-all duration-500 group-hover:border-orange-500/30 group-hover:-translate-y-1">

        {/* 🎬 THUMBNAIL */}
        <div className="relative aspect-video overflow-hidden">

          {/* Image */}
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* 🏷️ BADGES */}
          <div className="absolute top-3 left-3 flex gap-2 z-10">
            <div className="flex items-center gap-1 bg-orange-500 text-black px-2 py-1 rounded-full text-[9px] font-bold">
              <ShieldCheck size={10} />
              Ads Free
            </div>

            <div className="bg-black/60 text-white px-2 py-1 rounded-full text-[9px] border border-white/10">
              {course.category || "Course"}
            </div>
          </div>

          {/* ▶ PLAY BUTTON */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-xl scale-90 group-hover:scale-100 transition">
              <Play size={20} fill="black" className="ml-1" />
            </div>
          </div>
        </div>

        {/* 📄 CONTENT */}
        <div className="p-4 sm:p-5">

          {/* Instructor */}
          <p className="text-[12px] text-gray-500 uppercase tracking-widest mb-2">
            {course.instructor || "Instructor"}
          </p>

          {/* Title */}
          <h3 className="text-white text-lg sm:text-xl font-bold leading-tight mb-2 group-hover:text-orange-400 transition">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-gray-500 text-xs sm:text-sm line-clamp-2 mb-4">
            {course.description}
          </p>

          {/* CTA */}
          <div className="flex items-center justify-between mt-auto">
            <span className="text-[10px] uppercase tracking-wider text-gray-400">
              Start Learning
            </span>

            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:bg-orange-500 group-hover:border-orange-500 transition">
              <ArrowUpRight
                size={16}
                className="text-white group-hover:text-black transition"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import { Link } from "react-router-dom";
import { Play, Clock, User, Layers } from "lucide-react";

export default function CourseCard({ course }) {
  return (
    <div className="group relative bg-[#0A0A0A] border border-gray-800/60 rounded-[2.5rem] p-4 transition-all duration-500 hover:border-orange-500/40 hover:bg-[#0F0F0F] hover:shadow-[0_20px_50px_-20px_rgba(249,115,22,0.15)] hover:-translate-y-2">
      
      {/* ✨ Premium Badges */}
      <div className="absolute top-6 left-6 z-20 flex gap-2">
        <span className="bg-orange-500 text-black px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-xl">
          Free
        </span>
        <span className="bg-black/40 backdrop-blur-md text-white/70 px-3 py-1 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-white/5">
          Pro Content
        </span>
      </div>

      {/* 🖼️ Thumbnail Container */}
      <div className="aspect-video w-full overflow-hidden rounded-[1.8rem] mb-6 relative bg-gray-900 shadow-2xl">
        <img 
          src={course.thumbnail} 
          className="w-full h-full object-cover transition-all duration-700 opacity-80 group-hover:opacity-100 group-hover:scale-105" 
          alt={course.title}
        />
        
        {/* Play Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-2xl shadow-orange-500/40 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            <Play fill="black" size={24} className="ml-1" />
          </div>
        </div>

        {/* Gradient Bottom Fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
      </div>

      {/* 📝 Content Section */}
      <div className="px-2 pb-2">
        {/* Meta Row */}
        <div className="flex items-center gap-4 mb-3 text-[10px] font-black uppercase tracking-widest text-gray-500">
          <div className="flex items-center gap-1.5 group-hover:text-orange-400 transition-colors">
            <Layers size={12} /> {course.category || "Tech"}
          </div>
          <div className="flex items-center gap-1.5">
            <User size={12} /> {course.instructor || "Expert"}
          </div>
        </div>

        <h3 className="text-white font-bold text-lg md:text-xl line-clamp-1 mb-2 group-hover:text-orange-500 transition-colors tracking-tight">
          {course.title}
        </h3>
        
        <p className="text-gray-500 text-xs md:text-sm line-clamp-2 mb-6 leading-relaxed min-h-[40px]">
          {course.description}
        </p>

        {/* 🚀 Primary Action Button */}
        <Link 
          to={`/course/${course._id}`}
          className="relative w-full overflow-hidden group/btn block text-center py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] bg-white text-black hover:text-white"
        >
          <span className="relative z-10 transition-colors duration-300">
            Enter Module
          </span>
          {/* Animated Background Slide */}
          <div className="absolute inset-0 bg-orange-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
        </Link>
      </div>
    </div>
  );
}
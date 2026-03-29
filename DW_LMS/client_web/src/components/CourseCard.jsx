import { Link, useNavigate } from "react-router-dom";
import { Play, User, ArrowUpRight, Sparkles, ShieldCheck } from "lucide-react";

export default function CourseCard({ course }) {
  const navigate = useNavigate();

  // Handle click to trigger auto-play on the next page
  const handleNavigation = (e) => {
    e.preventDefault();
    navigate(`/course/${course._id}`, { state: { autoStart: true } });
  };

  return (
    <div 
      onClick={handleNavigation}
      className="group relative bg-[#070707] border border-white/5 rounded-[2rem] p-3 transition-all duration-500 hover:border-orange-500/30 hover:shadow-[0_0_40px_rgba(249,115,22,0.1)] cursor-pointer"
    >
      {/* 🖼️ Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden rounded-[1.5rem] mb-5 bg-[#151515] z-10">
        {/* ✨ Premium Badges */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          <div className="flex items-center gap-1 bg-orange-500 text-black px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider shadow-xl">
            <ShieldCheck size={10} />
            Ads Free
          </div>
          <div className="bg-black/60 backdrop-blur-xl text-white/90 px-2.5 py-1 rounded-full text-[8px] font-bold uppercase tracking-wider border border-white/10 shadow-lg">
            {course.category || "Pro"}
          </div>
        </div>

        <img 
          src={course.thumbnail} 
          className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" 
          alt={course.title}
        />
        
        {/* Cinematic Play Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-all duration-500 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md scale-75 group-hover:scale-100 transition-transform duration-500">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <Play fill="black" size={20} className="ml-1" />
            </div>
          </div>
        </div>
      </div>

      {/* 📝 Content Section */}
      <div className="px-3 pb-4 relative z-10">
        <div className="flex items-center gap-2 mb-3">
           <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{course.instructor || "Expert"}</span>
        </div>

        <h3 className="text-white font-extrabold text-xl mb-2 group-hover:text-orange-400 transition-colors tracking-tighter leading-tight">
          {course.title}
        </h3>
        
        <p className="text-gray-500 text-xs line-clamp-2 mb-6 font-medium leading-relaxed opacity-80 italic">
          {course.description}
        </p>

        {/* Action Button - Also triggers navigation */}
        <button className="group/btn relative w-full flex items-center justify-between px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 bg-white/[0.03] border border-white/10 text-white group-hover:bg-orange-500 group-hover:text-black group-hover:border-orange-500">
          <span>Start Module</span>
          <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </button>
      </div>
    </div>
  );
}
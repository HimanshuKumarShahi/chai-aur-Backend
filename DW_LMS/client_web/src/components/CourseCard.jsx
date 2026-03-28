import { Link } from "react-router-dom";

export default function CourseCard({ course }) {
  return (
    <div className="group relative bg-gray-900/40 border border-gray-800 rounded-[2rem] p-5 transition-all duration-500 hover:border-orange-500/40 hover:bg-gray-900/80 hover:shadow-[0_0_40px_-15px_rgba(249,115,22,0.2)]">
      
      {/* ✨ Premium Badges */}
      <div className="absolute top-7 left-7 z-10 flex gap-2">
        <span className="bg-orange-500 text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg shadow-orange-500/20">
          Free Access
        </span>
        <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter border border-white/10">
          ✨ No Ads
        </span>
      </div>

      {/* 🖼️ Thumbnail Container */}
      <div className="aspect-video w-full overflow-hidden rounded-2xl mb-5 relative bg-gray-800">
        <img 
          src={course.thumbnail} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
          alt={course.title}
        />
      </div>

      {/* 📝 Content Section */}
      <div className="px-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-white font-bold text-xl line-clamp-1 group-hover:text-orange-500 transition-colors">
            {course.title}
          </h3>
        </div>
        
        <p className="text-gray-500 text-sm line-clamp-2 mb-8 leading-relaxed h-10">
          {course.description}
        </p>

        {/* 🚀 Primary Action Button */}
        <Link 
          to={`/course/${course._id}`}
          className="w-full block text-center py-4 rounded-2xl font-black text-sm transition-all active:scale-95 bg-white text-black hover:bg-orange-500 hover:text-white shadow-xl shadow-white/5"
        >
          Start Watching — Ad Free
        </Link>
      </div>
    </div>
  );
}
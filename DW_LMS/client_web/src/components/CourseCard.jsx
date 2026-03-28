import { Link } from "react-router-dom";

export default function CourseCard({ course, isEnrolled = false }) {
  return (
    <div className="group relative bg-gray-900/40 border border-gray-800 rounded-2xl p-4 transition-all duration-500 hover:border-orange-500/40 hover:bg-gray-900/80">
      {/* Badge */}
      <div className="absolute top-6 left-6 z-10">
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter ${
          isEnrolled ? "bg-green-500 text-black" : "bg-orange-500 text-black"
        }`}>
          {isEnrolled ? "✓ Enrolled" : "Free Enrollment"}
        </span>
      </div>

      <div className="aspect-video w-full overflow-hidden rounded-xl mb-5">
        <img 
          src={course.thumbnail} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          alt={course.title}
        />
      </div>

      <h3 className="text-white font-bold text-xl mb-2 line-clamp-1">{course.title}</h3>
      <p className="text-gray-500 text-sm line-clamp-2 mb-6 leading-relaxed">{course.description}</p>

      <Link 
        to={`/course/${course._id}`}
        className={`w-full block text-center py-3 rounded-xl font-bold transition-all ${
          isEnrolled 
            ? "bg-gray-800 text-white hover:bg-gray-700" 
            : "bg-white text-black hover:bg-orange-500 hover:text-white"
        }`}
      >
        {isEnrolled ? "Continue Learning" : "Enroll for Free"}
      </Link>
    </div>
  );
}
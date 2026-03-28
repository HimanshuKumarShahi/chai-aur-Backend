import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import CourseCard from "../components/CourseCard";

export default function Home() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/course`)
      .then((res) => setCourses(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="bg-black text-white min-h-screen selection:bg-orange-500/30">
      <main>
        {/* --- Hero Section --- */}
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 px-6 overflow-hidden">
          {/* Background Glows */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-orange-600/20 blur-[120px] rounded-full -z-10" />
          
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-widest animate-pulse">
              New: AI & Web3 Courses Available
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black mb-6 leading-[1.1] tracking-tight">
              Master the <span className="text-orange-500">Digital</span> <br />
              <span className="italic">Frontier.</span>
            </h1>

            <p className="text-gray-400 max-w-2xl mx-auto text-lg md:text-xl mb-10 leading-relaxed">
              Skip the fluff. Learn directly from industry experts with project-based courses designed to get you hired.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/courses" className="bg-orange-500 text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-orange-400 transition-all hover:scale-105 shadow-xl shadow-orange-500/40 text-center">
                Get Started — It's Free
              </Link>
              <Link to="/enrolled" className="px-10 py-4 rounded-full font-bold text-lg border border-gray-800 hover:bg-gray-900 transition-all text-center">
                My Dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* --- Stats / Social Proof --- */}
        <section className="border-y border-gray-900 bg-gray-900/20 py-8">
          <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-around gap-8 text-center">
            <div><p className="text-2xl font-bold">12k+</p><p className="text-xs text-gray-500 uppercase">Students</p></div>
            <div><p className="text-2xl font-bold">45+</p><p className="text-xs text-gray-500 uppercase">Courses</p></div>
            <div><p className="text-2xl font-bold">4.9/5</p><p className="text-xs text-gray-500 uppercase">Rating</p></div>
          </div>
        </section>

        {/* --- Featured Courses --- */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Popular Courses</h2>
              <p className="text-gray-500">Top-rated by our community this month.</p>
            </div>
            <Link to="/courses" className="hidden md:block text-orange-500 font-semibold hover:underline">View all courses →</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.slice(0, 6).map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
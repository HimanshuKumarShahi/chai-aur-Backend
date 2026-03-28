import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react"; // 🔥 Added to identify user
import axios from "axios";
import CourseCard from "../components/CourseCard";

export default function Home() {
  const { user } = useUser();
  const [courses, setCourses] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]); // 🔥 New state for history
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch all courses for the 'Popular' section
        const coursesRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/course`);
        const allCourses = coursesRes.data;
        setCourses(allCourses);

        // 2. Fetch User Progress if logged in
        if (user) {
          const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/${user.id}`);
          const progress = userRes.data.progress || [];

          // 3. Merge progress with course data to get Titles/Thumbnails
          // We filter to show only courses that actually exist in the database
          const mergedRecent = progress
            .map(p => {
              const courseData = allCourses.find(c => c._id === p.courseId);
              return courseData ? { ...courseData, percentage: p.percentage } : null;
            })
            .filter(item => item !== null)
            .reverse() // Most recently updated first
            .slice(0, 3); // Only show top 3 recent

          setRecentCourses(mergedRecent);
        }
      } catch (err) {
        console.error("Home Data Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="bg-black text-white min-h-screen selection:bg-orange-500/30">
      <main>
        {/* --- Hero Section --- */}
        <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 px-6 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] bg-orange-600/20 blur-[120px] rounded-full -z-10" />
          
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold uppercase tracking-widest animate-pulse">
              New: AI & Tech Full-Stack Courses Available
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
              <Link to="/profile" className="px-10 py-4 rounded-full font-bold text-lg border border-gray-800 hover:bg-gray-900 transition-all text-center">
                My Dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* --- 🔥 RECENTLY WATCHED SECTION --- */}
        {user && recentCourses.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-900">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping"></span>
              <h2 className="text-2xl font-black uppercase tracking-tighter italic">Continue Watching</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentCourses.map((course) => (
                <Link 
                  key={course._id} 
                  to={`/course/${course._id}`}
                  className="group relative bg-gray-900/40 border border-gray-800 rounded-3xl p-4 flex items-center gap-4 hover:border-orange-500/40 transition-all"
                >
                  <div className="w-24 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-gray-800">
                    <img src={course.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{course.title}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500" style={{ width: `${course.percentage}%` }}></div>
                      </div>
                      <span className="text-[10px] font-black text-gray-500">{course.percentage}%</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

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
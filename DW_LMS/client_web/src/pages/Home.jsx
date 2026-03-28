import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import { Play, ArrowRight, Star, Users, BookOpen } from "lucide-react"; // Install lucide-react
import CourseCard from "../components/CourseCard";

export default function Home() {
  const { user } = useUser();
  const [courses, setCourses] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/course`,
        );
        const allCourses = coursesRes.data;
        setCourses(allCourses);

        if (user) {
          const userRes = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/user/${user.id}`,
          );
          const progress = userRes.data.progress || [];

          const mergedRecent = progress
            .map((p) => {
              const courseData = allCourses.find((c) => c._id === p.courseId);
              return courseData
                ? { ...courseData, percentage: p.percentage }
                : null;
            })
            .filter((item) => item !== null)
            .reverse()
            .slice(0, 3);

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
    <div className="bg-black text-white min-h-screen selection:bg-orange-500/30 overflow-x-hidden">
      {/* --- Background Decorative Elements --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[600px] bg-orange-600/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      <main className="relative z-10">
        {/* --- Hero Section --- */}
        <section className="pt-24 pb-16 md:pt-40 md:pb-32 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-400 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
              </span>
              New: AI & Tech Full-Stack Courses 2026
            </div>

            <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[0.9] tracking-tighter">
              MASTER THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                DIGITAL{" "}
              </span>
              <span className="italic font-light">FRONTIER.</span>
            </h1>

            <p className="text-gray-400 max-w-xl mx-auto text-base md:text-lg mb-12 leading-relaxed font-medium">
              Skip the fluff. Learn directly from industry experts with
              project-based courses designed to build your portfolio and get you
              hired.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Link
                to="/courses"
                className="group bg-white text-black px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
              >
                Start Learning{" "}
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                to="/profile"
                className="px-8 py-4 rounded-2xl font-bold text-lg border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:bg-gray-800 transition-all text-center"
              >
                My Dashboard
              </Link>
            </div>
          </div>
        </section>

        {/* --- 🔥 RECENTLY WATCHED (Mobile-Friendly) --- */}
        {user && recentCourses.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-500/10 rounded-lg">
                  <Play size={18} className="text-orange-500 fill-orange-500" />
                </div>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                  Jump Back In
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recentCourses.map((course) => (
                <Link
                  key={course._id}
                  to={`/course/${course._id}`}
                  className="group relative bg-[#0A0A0A] border border-gray-800/50 rounded-2xl p-4 flex items-center gap-4 hover:border-orange-500/50 hover:bg-gray-900/50 transition-all"
                >
                  <div className="w-20 h-14 md:w-24 md:h-16 rounded-xl overflow-hidden flex-shrink-0 border border-gray-800 bg-black">
                    <img
                      src={course.thumbnail}
                      className="w-full h-full object-cover grayscale-[50%] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                      alt=""
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate group-hover:text-orange-400 transition-colors">
                      {course.title}
                    </h3>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                        <span>Progress</span>
                        <span>{course.percentage}%</span>
                      </div>
                      <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-orange-500 transition-all duration-1000"
                          style={{ width: `${course.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* --- Stats Section --- */}
        <section className="border-y border-gray-900 bg-[#050505] py-12">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center md:border-r border-gray-900 last:border-0">
              <Users className="mx-auto mb-2 text-gray-600" size={20} />
              <p className="text-2xl md:text-3xl font-black italic">12K+</p>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">
                Global Students
              </p>
            </div>
            <div className="text-center md:border-r border-gray-900 last:border-0">
              <BookOpen className="mx-auto mb-2 text-gray-600" size={20} />
              <p className="text-2xl md:text-3xl font-black italic">45+</p>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">
                Pro Courses
              </p>
            </div>
            <div className="text-center md:border-r border-gray-900 last:border-0">
              <Star className="mx-auto mb-2 text-orange-500" size={20} />
              <p className="text-2xl md:text-3xl font-black italic text-orange-500">
                4.9/5
              </p>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">
                Avg Rating
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center -space-x-2 mb-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border-2 border-black bg-gray-800"
                  ></div>
                ))}
              </div>
              <p className="text-2xl md:text-3xl font-black italic">Active</p>
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mt-1">
                Community
              </p>
            </div>
          </div>
        </section>

        {/* --- Featured Courses --- */}
        {/* --- Featured Courses --- */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">
                POPULAR{" "}
                <span className="text-orange-500 underline decoration-orange-500/20 underline-offset-8">
                  COURSES
                </span>
              </h2>
              <p className="text-gray-500 font-medium">
                Top-rated curriculum by our community this month.
              </p>
            </div>
            <Link
              to="/courses"
              className="flex items-center gap-2 text-orange-500 font-bold hover:gap-4 transition-all uppercase text-xs tracking-widest"
            >
              View All Catalog <ArrowRight size={16} />
            </Link>
          </div>

          {/* Changed grid-cols-3 to grid-cols-4 for a perfect 4-item row on large screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {courses.slice(0, 4).map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </section>
      </main>

      
    </div>
  );
}

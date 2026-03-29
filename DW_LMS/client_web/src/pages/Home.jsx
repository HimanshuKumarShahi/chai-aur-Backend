import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import axios from "axios";
import {
  Play,
  ArrowRight,
  Star,
  Users,
  BookOpen,
  Sparkles,
  ShieldCheck,
  Rocket,
} from "lucide-react";
import CourseCard from "../components/CourseCard";

export default function Home() {
  const { user } = useUser();
  const [courses, setCourses] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/course`
      );
      setCourses(res.data);

      if (user) {
        const userRes = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/${user.id}`
        );

        const merged = (userRes.data.progress || [])
          .map((p) => {
            const course = res.data.find(c => c._id === p.courseId);
            return course ? { ...course, percentage: p.percentage } : null;
          })
          .filter(Boolean)
          .slice(-3)
          .reverse();

        setRecentCourses(merged);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="bg-black text-white min-h-screen">

      {/* 🔥 HERO */}
      <section className="px-6 pt-28 md:pt-36 pb-24 text-center">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs tracking-widest text-orange-500 uppercase mb-6">
            The Future of Learning
          </p>

          <h1 className="text-5xl md:text-7xl font-black leading-tight">
            Learn Skills That <br />
            <span className="text-orange-500">Actually Pay Off.</span>
          </h1>

          <p className="mt-6 text-gray-400 max-w-2xl mx-auto">
            Real-world courses. Real projects. 
            — just skill building that moves your career forward.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/courses"
              className="bg-orange-500 px-8 py-4 rounded-xl font-bold hover:bg-orange-600 transition"
            >
              Start Learning
            </Link>

            <Link
              to="/profile"
              className="border border-white/10 px-8 py-4 rounded-xl hover:bg-white/5 transition"
            >
              My Dashboard
            </Link>
          </div>
        </div>
      </section>


      {/* 🔁 RECENT */}
      {user && recentCourses.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <h2 className="text-2xl font-bold mb-6 flex gap-2 items-center">
            <Play size={18} className="text-orange-500" />
            Continue Learning
          </h2>

          <div className="grid md:grid-cols-3 gap-5">
            {recentCourses.map((c) => (
              <Link
                key={c._id}
                to={`/course/${c._id}`}
                className="p-4 bg-[#0a0a0a] rounded-xl border border-white/5"
              >
                <img
                  src={c.thumbnail}
                  className="rounded-lg mb-3"
                />

                <h3 className="font-bold text-sm">{c.title}</h3>

                <div className="mt-2 h-1 bg-gray-800 rounded-full">
                  <div
                    className="h-full bg-orange-500"
                    style={{ width: `${c.percentage}%` }}
                  />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 🚀 FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <Rocket className="text-orange-500 mb-3" />
            <h3 className="font-bold text-lg">Fast Learning</h3>
            <p className="text-gray-500 text-sm mt-2">
              Skip theory overload. Learn what actually matters.
            </p>
          </div>

          <div>
            <ShieldCheck className="text-orange-500 mb-3" />
            <h3 className="font-bold text-lg">Real Projects</h3>
            <p className="text-gray-500 text-sm mt-2">
              Build portfolio-ready applications.
            </p>
          </div>

          <div>
            <Sparkles className="text-orange-500 mb-3" />
            <h3 className="font-bold text-lg">Modern Stack</h3>
            <p className="text-gray-500 text-sm mt-2">
              Learn latest tools used in industry.
            </p>
          </div>
        </div>
      </section>

      {/* 📊 STATS */}
      <section className="border-y border-white/5 py-14">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <Users className="mx-auto mb-2 text-gray-500" />
            <p className="text-2xl font-bold">10+</p>
            <p className="text-xs text-gray-500">Students</p>
          </div>

          <div>
            <BookOpen className="mx-auto mb-2 text-gray-500" />
            <p className="text-2xl font-bold">5+</p>
            <p className="text-xs text-gray-500">Courses</p>
          </div>

          <div>
            <Star className="mx-auto mb-2 text-orange-500" />
            <p className="text-2xl font-bold text-orange-500">2.9</p>
            <p className="text-xs text-gray-500">Rating</p>
          </div>

          <div>
            <p className="text-2xl font-bold">Active</p>
            <p className="text-xs text-gray-500">Community</p>
          </div>
        </div>
      </section>

      {/* 🎓 COURSES */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex justify-between mb-10">
          <h2 className="text-4xl font-black">Popular Courses</h2>
          <Link to="/courses" className="text-orange-500 flex items-center gap-1">
            View All <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.slice(0, 4).map((c) => (
            <CourseCard key={c._id} course={c} />
          ))}
        </div>
      </section>

      {/* 🧠 LEARNING PATH */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-black mb-10">Learning Paths</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {["Frontend Dev", "Backend Dev", "Full Stack"].map((p) => (
            <div key={p} className="p-6 bg-[#0a0a0a] border border-white/5 rounded-xl">
              <h3 className="font-bold">{p}</h3>
              <p className="text-gray-500 text-sm mt-2">
                Structured roadmap to master {p}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 💬 TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-black mb-10">What Students Say</h2>

        <p className="text-gray-400 max-w-2xl mx-auto">
          “This platform help students for job with skills.”
        </p>
      </section>

      {/* 🔥 CTA */}
      <section className="text-center py-24 px-6">
        <h2 className="text-4xl font-black mb-6">
          Start Building Your Future Today
        </h2>
        <br />

        <Link
          to="/courses"
          className="bg-orange-500 px-10 py-4 rounded-xl font-bold hover:bg-orange-600 transition"
        >
          Explore Courses
        </Link>
      </section>

    </div>
  );
}
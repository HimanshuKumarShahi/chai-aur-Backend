import { useEffect, useState } from "react";
import axios from "axios";
import { Search, X, Layers, SlidersHorizontal, Info } from "lucide-react";
import CourseCard from "../components/CourseCard";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const categories = [
    "All",
    "Python",
    "React",
    "JavaScript",
    "Tech",
    "Backend",
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/course`,
        );
        setCourses(res.data);
        setFilteredCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const searchTerm = search.toLowerCase().trim();
    const selectedCat = activeCategory.toLowerCase();

    const filtered = courses.filter((c) => {
      const title = (c.title || "").toLowerCase();
      const description = (c.description || "").toLowerCase();
      const category = (c.category || "").toLowerCase();

      const isSearchMatch =
        title.includes(searchTerm) || description.includes(searchTerm);
      const isCategoryMatch =
        activeCategory === "All" ||
        category === selectedCat ||
        title.includes(selectedCat);

      return isSearchMatch && isCategoryMatch;
    });

    setFilteredCourses(filtered);
  }, [search, activeCategory, courses]);

  return (
    <div className="bg-[#050505] text-white min-h-screen pb-32 selection:bg-orange-500/30">
      {/* 🏔️ Header & Hero Section */}
      <section className="relative pt-24 pb-16 px-6 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-orange-600/10 blur-[120px] -z-10" />

        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
            EXPLORE <br />
            <span className="text-orange-500 italic">COURSES.</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg max-w-lg mx-auto mb-12">
            Filter by technology or search for specific topics to accelerate
            your career.
          </p>

          {/* 🔍 Enhanced Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-10 group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search
                size={20}
                className="text-gray-500 group-focus-within:text-orange-500 transition-colors"
              />
            </div>
            <input
              type="text"
              placeholder="What do you want to learn today?"
              className="w-full bg-gray-900/40 backdrop-blur-xl border border-gray-800 p-5 pl-14 pr-14 rounded-2xl focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all placeholder:text-gray-600 font-medium text-lg shadow-2xl"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* 🏷️ Smart Filter Chips */}
          <div className="flex flex-wrap justify-center items-center gap-3">
            <div className="flex items-center gap-2 mr-2 text-gray-500">
              <SlidersHorizontal size={14} />
              <span className="text-[10px] uppercase font-bold tracking-widest">
                Filters
              </span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-[0.1em] transition-all border ${
                  activeCategory === cat
                    ? "bg-white border-white text-black scale-105 shadow-xl shadow-white/10"
                    : "bg-transparent border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 📚 Results Grid */}
      <main className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-2">
            <Layers size={18} className="text-orange-500" />
            <span className="text-sm font-bold uppercase tracking-widest text-gray-400">
              {filteredCourses.length} Courses Found
            </span>
          </div>
        </div>

        {loading ? (
          /* ✨ Improved Skeleton Loader */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-4">
                <div className="aspect-video bg-gray-900/80 rounded-3xl animate-pulse border border-gray-800" />
                <div className="h-6 w-3/4 bg-gray-900/80 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-900/80 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="hover:-translate-y-2 transition-transform duration-300"
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        ) : (
          /* 🚫 Zero Results View */
          <div className="max-w-md mx-auto text-center py-24 px-8 bg-gray-900/20 rounded-[3rem] border border-dashed border-gray-800 backdrop-blur-sm">
            <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={32} className="text-gray-700" />
            </div>
            <h3 className="text-2xl font-black mb-2">NO MATCHES FOUND</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              We couldn't find anything matching{" "}
              <span className="text-white font-bold">"{search}"</span>. Try
              adjusting your filters or checking your spelling.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="bg-orange-500 text-black px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-400 transition-all shadow-lg shadow-orange-500/20"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

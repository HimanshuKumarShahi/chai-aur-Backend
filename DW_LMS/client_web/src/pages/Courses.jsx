import { useEffect, useState } from "react";
import axios from "axios";
import CourseCard from "../components/CourseCard";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  const categories = ["All", "Python", "React", "JavaScript", "Tech", "Backend"];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/course`);
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

  // 🔥 POWERFUL FILTER LOGIC
  useEffect(() => {
    const searchTerm = search.toLowerCase().trim();
    const selectedCat = activeCategory.toLowerCase();

    const filtered = courses.filter((c) => {
      const title = (c.title || "").toLowerCase();
      const description = (c.description || "").toLowerCase();
      const category = (c.category || "").toLowerCase();

      // 1. Determine if Search matches
      const isSearchMatch = title.includes(searchTerm) || description.includes(searchTerm);

      // 2. Determine if Category matches
      // Logic: If Category is 'All', it's a match. Otherwise, check exact field or title fallback.
      const isCategoryMatch = 
        activeCategory === "All" || 
        category === selectedCat || 
        title.includes(selectedCat);

      // 3. COMBINED LOGIC: 
      // If the user is searching (searchTerm length > 0), we prioritize the search.
      // But we still respect the category if one is selected.
      return isSearchMatch && isCategoryMatch;
    });

    setFilteredCourses(filtered);
  }, [search, activeCategory, courses]);

  return (
    <div className="bg-black text-white min-h-screen pb-20 selection:bg-orange-500/30">
      
      {/* 🏔️ Header Section */}
      <section className="pt-20 pb-12 px-6 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
          Course <span className="text-orange-500">Catalog.</span>
        </h1>
        
        {/* 🔍 Search Bar with Clear Button */}
        <div className="relative max-w-xl mx-auto mb-10 group">
          <input
            type="text"
            placeholder="Search by name (e.g. 'Cloud', 'AI')..."
            className="w-full bg-gray-900/50 border border-gray-800 p-5 pl-12 pr-12 rounded-2xl focus:border-orange-500 outline-none transition-all placeholder:text-gray-600 font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute left-5 top-5 opacity-40 group-focus-within:opacity-100 transition-opacity">🔍</span>
          {search && (
            <button 
              onClick={() => setSearch("")}
              className="absolute right-5 top-5 text-gray-500 hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* 🏷️ Smart Filter Chips */}
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all border ${
                activeCategory === cat 
                ? "bg-orange-500 border-orange-500 text-black scale-110 shadow-lg shadow-orange-500/20" 
                : "bg-gray-900 border-gray-800 text-gray-400 hover:text-white hover:border-gray-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* 📚 Results Grid */}
      <main className="max-w-7xl mx-auto px-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-gray-900/50 rounded-[2rem] border border-gray-800" />
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          /* 🚫 Zero Results View */
          <div className="text-center py-32 bg-gray-900/10 rounded-[3rem] border border-dashed border-gray-800">
            <div className="text-5xl mb-4">🛸</div>
            <h3 className="text-xl font-bold text-gray-400">
              No results for <span className="text-orange-500">"{search}"</span>
              {activeCategory !== "All" && <span> in {activeCategory}</span>}
            </h3>
            <p className="text-gray-600 mt-2 text-sm">Try searching for something else or reset the filters.</p>
            <button 
              onClick={() => {setSearch(""); setActiveCategory("All")}}
              className="mt-6 bg-white text-black px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all active:scale-95"
            >
              Reset Everything
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  X,
  Layers,
  SlidersHorizontal
} from "lucide-react";
import CourseCard from "../components/CourseCard";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sort, setSort] = useState("latest");

  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    "All",
    "Python",
    "React",
    "JavaScript",
    "Tech",
    "Backend",
    "AI/ML",
    "Data Science",
    "DevOps"
  ];

  // FETCH COURSES
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/course`
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

  // FILTER + SORT LOGIC
  useEffect(() => {
    let data = [...courses];

    const term = search.toLowerCase().trim();

    // SEARCH
    data = data.filter((c) => {
      const title = (c.title || "").toLowerCase();
      const desc = (c.description || "").toLowerCase();
      return title.includes(term) || desc.includes(term);
    });

    // CATEGORY
    if (activeCategory !== "All") {
      data = data.filter(
        (c) =>
          (c.category || "").toLowerCase() ===
          activeCategory.toLowerCase()
      );
    }

    // SORT
    if (sort === "az") {
      data.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "za") {
      data.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sort === "latest") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sort === "oldest") {
      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFilteredCourses(data);
  }, [search, activeCategory, sort, courses]);

  return (
    <div className="bg-[#050505] text-white min-h-screen pb-32">

      {/* 🔥 HERO */}
      <section className="pt-24 pb-14 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-black mb-6">
          EXPLORE <span className="text-orange-500">COURSES</span>
        </h1>

        {/* SEARCH */}
        <div className="relative max-w-2xl mx-auto mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 pl-12 pr-12 py-4 rounded-xl outline-none focus:border-orange-500"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* FILTER TOGGLE (MOBILE) */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center gap-2 mx-auto bg-gray-900 px-4 py-2 rounded-xl border border-gray-800"
        >
          <SlidersHorizontal size={16} /> Filters
        </button>

        {/* FILTER BAR */}
        <div
          className={`${
            showFilters ? "flex" : "hidden"
          } md:flex flex-col md:flex-row gap-4 justify-center mt-6`}
        >
          {/* CATEGORY */}
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="bg-gray-900 border border-gray-800 px-4 py-3 rounded-xl"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* SORT */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-gray-900 border border-gray-800 px-4 py-3 rounded-xl"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="az">A → Z</option>
            <option value="za">Z → A</option>
          </select>

          {/* CLEAR */}
          <button
            onClick={() => {
              setSearch("");
              setActiveCategory("All");
              setSort("latest");
            }}
            className="bg-orange-500 text-black px-6 py-3 rounded-xl font-bold text-xs"
          >
            Clear
          </button>
        </div>
      </section>

      {/* 📚 RESULTS */}
      <main className="max-w-7xl mx-auto px-6">

        <div className="flex items-center gap-2 mb-8">
          <Layers size={18} className="text-orange-500" />
          <span className="text-sm text-gray-400">
            {filteredCourses.length} Courses Found
          </span>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-900 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold mb-2">No Results</h3>
            <p className="text-gray-500 mb-6">
              Try changing filters or search term
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="bg-orange-500 px-6 py-3 rounded-xl text-black font-bold"
            >
              Reset
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
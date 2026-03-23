import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Star } from "lucide-react";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/restaurants");
        const data = await res.json();
        setRestaurants(data);
        setFiltered(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = [...restaurants];

    if (search) {
      result = result.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter === "rating") {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    if (filter === "offers") {
      result = result.filter((r) => r.hasOffer);
    }

    setFiltered(result);
  }, [search, filter, restaurants]);

  return (
    <div className="bg-gray-50 min-h-screen">



      {/* SEARCH */}
      <div className="px-6 mt-6">
        <div className="flex items-center bg-white shadow rounded-xl px-4 py-3">
          <Search className="text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search for restaurants..."
            className="ml-3 w-full outline-none text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex gap-3 px-6 mt-4 overflow-x-auto">
        {[
          { id: "all", label: "All" },
          { id: "rating", label: "Top Rated" },
          { id: "offers", label: "Offers" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
              filter === f.id
                ? "bg-orange-500 text-white"
                : "bg-white border text-gray-600"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* RESTAURANTS */}
      <div className="px-6 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">

        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <p>No restaurants found</p>
        ) : (
          filtered.map((r) => (
            <Link
              to={`/restaurant/${r._id}`}
              key={r._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              {/* IMAGE */}
              <div className="h-40 w-full overflow-hidden">
                <img
                  src={r.image}
                  alt={r.name}
                  className="w-full h-full object-cover hover:scale-105 transition"
                />
              </div>

              {/* CONTENT */}
              <div className="p-4">
                <h2 className="text-lg font-semibold">{r.name}</h2>

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1 text-green-600 text-sm font-medium">
                    <Star size={14} fill="green" />
                    {r.rating || "4.0"}
                  </div>

                  <p className="text-gray-500 text-xs">20-30 min</p>
                </div>

                {r.hasOffer && (
                  <p className="text-orange-500 text-xs mt-2 font-medium">
                    🔥 Special Offer Available
                  </p>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
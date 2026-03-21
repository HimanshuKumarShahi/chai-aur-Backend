import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // High-quality Pexels fallback images for a premium look
  const fallbackImages = [
    "https://images.pexels.com/photos/1639562/pexels-photo-1639562.jpeg?auto=compress&cs=tinysrgb&w=800", // Burger
    "https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=800", // Pizza
    "https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=800", // Plated food
    "https://images.pexels.com/photos/2087748/pexels-photo-2087748.jpeg?auto=compress&cs=tinysrgb&w=800", // Tacos
    "https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=800"  // Pancakes
  ];

  // Dummy categories for the Swiggy-like top scroll bar
  const categories = [
    { name: "Pizza", emoji: "🍕" }, { name: "Burger", emoji: "🍔" },
    { name: "Biryani", emoji: "🍗" }, { name: "Healthy", emoji: "🥗" },
    { name: "Desserts", emoji: "🍰" }, { name: "Chinese", emoji: "🍜" },
    { name: "Drinks", emoji: "🥤" }, { name: "South Indian", emoji: "🥞" }
  ];

  useEffect(() => {
    fetch("http://localhost:5000/api/restaurants")
      .then(res => res.json())
      .then(data => {
        setRestaurants(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch", err);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="w-full">
      
      {/* --- HERO / SEARCH SECTION --- */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl p-8 md:p-12 mb-12 shadow-sm border border-red-100 flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Craving something <span className="text-red-600">delicious?</span>
        </h1>
        
        {/* Search Bar */}
        <div className="w-full max-w-2xl flex items-center bg-white rounded-2xl shadow-md overflow-hidden p-2 border border-gray-100 focus-within:ring-2 focus-within:ring-red-500 transition-all">
          <span className="pl-4 text-xl">🔍</span>
          <input 
            type="text" 
            placeholder="Search for restaurants, cuisines, or dishes..." 
            className="w-full px-4 py-3 outline-none text-gray-700 bg-transparent font-medium"
          />
          <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* --- QUICK CATEGORIES (Mind to eat?) --- */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">What's on your mind?</h2>
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat, index) => (
            <div key={index} className="flex flex-col items-center gap-2 min-w-[80px] cursor-pointer group">
              <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center text-4xl border border-gray-100 group-hover:shadow-md group-hover:-translate-y-1 transition-all">
                {cat.emoji}
              </div>
              <span className="font-semibold text-gray-700 text-sm group-hover:text-red-600">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* --- RESTAURANT GRID SECTION --- */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">
          Top restaurants in Patna
        </h2>

        {isLoading ? (
          // Skeleton Loading State
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse flex flex-col gap-4">
                <div className="bg-gray-200 h-56 rounded-2xl w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : restaurants.length === 0 ? (
          // Empty State
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">🏪</span>
            <h3 className="text-2xl font-bold text-gray-800">No restaurants yet</h3>
            <p className="text-gray-500 mt-2">Check back later or add some from the Admin dashboard!</p>
          </div>
        ) : (
          // The Actual Grid
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {restaurants.map((r, index) => {
              // Pick a fallback image based on the index if the restaurant image is missing or too short
              const imageSrc = r.image && r.image.length > 10 ? r.image : fallbackImages[index % fallbackImages.length];
              
              // Generate a mock rating between 3.8 and 4.9 for display
              const rating = (Math.random() * (4.9 - 3.8) + 3.8).toFixed(1);

              return (
                // Wrap the whole card in a Link. Next step will be creating the /restaurant/:id page!
                <Link to={`/restaurant/${r._id}`} key={r._id} className="group cursor-pointer">
                  
                  {/* Image Container */}
                  <div className="relative overflow-hidden rounded-2xl shadow-sm mb-4 h-56">
                    <img 
                      src={imageSrc} 
                      alt={r.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out" 
                    />
                    {/* Dark gradient overlay at the bottom for text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Time/Offer Badge */}
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-lg text-xs font-extrabold text-gray-800 shadow-md">
                      30-40 MINS
                    </div>
                  </div>

                  {/* Info Container */}
                  <div className="px-1">
                    <div className="flex justify-between items-start mb-1">
                      <h2 className="text-xl font-bold text-gray-900 truncate pr-2" title={r.name}>
                        {r.name}
                      </h2>
                      {/* Rating Badge */}
                      <div className="flex items-center gap-1 bg-green-700 text-white px-1.5 py-0.5 rounded text-sm font-bold shadow-sm shrink-0">
                        {rating} <span className="text-[10px]">★</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-500 text-sm font-medium line-clamp-1 mb-1">
                      {r.cuisine && r.cuisine.length > 0 ? r.cuisine.join(", ") : "North Indian, Fast Food"}
                    </p>
                    <p className="text-gray-400 text-sm line-clamp-1 truncate">
                      📍 {r.address}
                    </p>
                  </div>

                </Link>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";

export default function AdminDashboard() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch restaurants on load
  const fetchRestaurants = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/restaurants");
      const data = await response.json();
      setRestaurants(data);
    } catch (error) {
      console.error("Failed to load restaurants", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // 2. The Bulletproof Delete Function
  const handleDeleteRestaurant = async (id, name) => {
    const isConfirmed = window.confirm(`⚠️ ARE YOU SURE?\n\nThis will permanently delete "${name}" and all its menu items. This cannot be undone.`);
    
    if (!isConfirmed) return;

    try {
      const token = await getToken();
      
      const response = await fetch(`http://localhost:5000/api/restaurants/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.ok) {
        alert("🗑️ Restaurant deleted successfully.");
        // Instantly remove it from the UI without refreshing
        setRestaurants(restaurants.filter(r => r._id !== id)); 
      } else {
        // SAFETY CATCH: Read as plain text first to prevent the JSON "<!DOCTYPE" crash
        const errorText = await response.text(); 
        try {
          // If the server sent a proper JSON error message, parse it
          const data = JSON.parse(errorText);
          alert("❌ Failed to delete: " + data.message);
        } catch {
          // If the parsing fails (meaning the server sent back an HTML 404 page)
          alert(`❌ Server Error ${response.status}: The DELETE route was not found on your backend. Make sure your Express server has router.delete('/:id') set up!`);
        }
      }
    } catch (error) {
      console.error("Delete network error", error);
      alert("Something went wrong checking the network!");
    }
  };

  // 3. Dynamic Stats
  const stats = [
    { title: "Today's Revenue", value: "₹0", trend: "+0%", icon: "💰", color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Total Orders", value: "0", trend: "0 Today", icon: "📦", color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Active Restaurants", value: restaurants.length, trend: "Live", icon: "🏪", color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Menu Items", value: "0", trend: "Needs Setup", icon: "🍔", color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full pb-10">
      
      {/* --- DASHBOARD HEADER --- */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mt-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome back, {user?.firstName || "Admin"}! 👋
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Here is what's happening across your Cloudverse restaurants today.
          </p>
        </div>
        <div className="text-sm font-bold text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
          📅 {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* --- ANALYTICS OVERVIEW --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${stat.bg}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-500">{stat.title}</p>
              <h3 className="text-2xl font-extrabold text-gray-900">{stat.value}</h3>
              <p className={`text-xs font-bold mt-1 ${stat.color}`}>{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      {/* --- QUICK ACTIONS --- */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Link to="/admin/add-restaurant" className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-red-200 transition-all cursor-pointer flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">Register Restaurant</h3>
            <p className="text-gray-500 text-sm mt-1 font-medium leading-relaxed">Open a new branch or register a brand new restaurant on the platform.</p>
            <span className="inline-block mt-3 text-red-600 font-bold text-sm">Get Started →</span>
          </div>
        </Link>

        <Link to="/admin/add-food" className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-red-200 transition-all cursor-pointer flex items-start gap-5">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">Update Menu Items</h3>
            <p className="text-gray-500 text-sm mt-1 font-medium leading-relaxed">Add new dishes, beverages, or combo meals to an existing restaurant.</p>
            <span className="inline-block mt-3 text-orange-600 font-bold text-sm">Add Item →</span>
          </div>
        </Link>
      </div>

      {/* --- LIVE RESTAURANT MANAGEMENT (The Delete Section) --- */}
      <h2 className="text-xl font-bold text-gray-900 mb-4 border-t border-gray-200 pt-8">Manage Your Restaurants</h2>
      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-10">
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 font-bold animate-pulse">Loading restaurants...</div>
        ) : restaurants.length === 0 ? (
          <div className="p-8 text-center text-gray-500 font-bold">No restaurants found. Add one using the Quick Actions above!</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {restaurants.map((r) => (
              <div key={r._id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                
                <div className="flex items-center gap-4">
                  <img 
                    src={r.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"} 
                    alt={r.name} 
                    className="w-16 h-16 rounded-xl object-cover border border-gray-200 shadow-sm"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{r.name}</h3>
                    <p className="text-sm text-gray-500 font-medium">📍 {r.address}</p>
                  </div>
                </div>

                <button 
                  onClick={() => handleDeleteRestaurant(r._id, r.name)}
                  className="flex items-center gap-2 bg-white text-red-600 border-2 border-red-100 px-4 py-2 rounded-xl font-bold hover:bg-red-600 hover:text-white transition-all active:scale-95 shadow-sm"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
                
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
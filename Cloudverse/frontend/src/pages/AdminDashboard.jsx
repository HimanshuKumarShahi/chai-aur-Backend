import { Link } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export default function AdminDashboard() {
  const { user } = useUser();

  // Mock data for the analytics overview
  const stats = [
    { title: "Today's Revenue", value: "₹0", trend: "+0%", icon: "💰", color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Total Orders", value: "0", trend: "0 Today", icon: "📦", color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Active Restaurants", value: "1", trend: "Live", icon: "🏪", color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Menu Items", value: "0", trend: "Needs Setup", icon: "🍔", color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full">
      
      {/* --- DASHBOARD HEADER --- */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        
        {/* Action Card: Add Restaurant */}
        <Link 
          to="/admin/add-restaurant" 
          className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-red-200 transition-all cursor-pointer flex items-start gap-5"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">Register Restaurant</h3>
            <p className="text-gray-500 text-sm mt-1 font-medium leading-relaxed">
              Open a new branch or register a brand new restaurant on the platform. Add location and storefront details.
            </p>
            <span className="inline-block mt-3 text-red-600 font-bold text-sm">Get Started →</span>
          </div>
        </Link>

        {/* Action Card: Add Food */}
        <Link 
          to="/admin/add-food" 
          className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-red-200 transition-all cursor-pointer flex items-start gap-5"
        >
          <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors">Update Menu Items</h3>
            <p className="text-gray-500 text-sm mt-1 font-medium leading-relaxed">
              Add new dishes, beverages, or combo meals to an existing restaurant. Upload high-res food images.
            </p>
            <span className="inline-block mt-3 text-orange-600 font-bold text-sm">Add Item →</span>
          </div>
        </Link>

      </div>

      {/* --- RECENT ACTIVITY (Placeholder) --- */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h2>
      <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm flex flex-col items-center justify-center">
        <span className="text-5xl block mb-3 opacity-50">🧾</span>
        <h3 className="text-lg font-bold text-gray-700">No recent orders</h3>
        <p className="text-gray-500 mt-1">When customers place an order, it will appear here in real-time.</p>
      </div>

    </div>
  );
}
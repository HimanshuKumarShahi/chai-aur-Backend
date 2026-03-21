import { Outlet, Link, useLocation } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";

export default function AdminLayout() {
  const location = useLocation();

  // Helper function to highlight the active menu item
  const linkBaseStyle = "flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-4";
  const getLinkStyle = (path) => {
    return location.pathname === path
      ? `${linkBaseStyle} border-red-500 bg-gray-800 text-white` // Active State
      : `${linkBaseStyle} border-transparent text-gray-400 hover:bg-gray-800 hover:text-white hover:border-red-400`; // Inactive State
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-gray-900 text-white shadow-2xl flex flex-col z-20 hidden md:flex">
        {/* Brand Logo */}
        <div className="h-20 flex items-center px-6 border-b border-gray-800">
          <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <span className="text-2xl">🍔</span>
            <span className="font-extrabold text-xl tracking-tight text-white">
              Cloudverse <span className="text-red-500">Admin</span>
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-6 flex flex-col gap-1">
          <p className="px-6 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Menu</p>

          <Link to="/admin" className={getLinkStyle('/admin')}>
            {/* Dashboard Icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Dashboard
          </Link>

          <Link to="/admin/add-restaurant" className={getLinkStyle('/admin/add-restaurant')}>
            {/* Storefront Icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            Add Restaurant
          </Link>

          <Link to="/admin/add-food" className={getLinkStyle('/admin/add-food')}>
            {/* Food/Plus Icon */}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Food Item
          </Link>
        </div>

        {/* Exit to Main App */}
        <div className="p-4 border-t border-gray-800">
          <Link to="/" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to App
          </Link>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-20 bg-white shadow-sm flex items-center justify-between px-8 border-b border-gray-100 z-10">
          <h2 className="text-xl font-bold text-gray-800">
            {location.pathname === '/admin' && "Overview"}
            {location.pathname === '/admin/add-restaurant' && "Restaurant Management"}
            {location.pathname === '/admin/add-food' && "Menu Management"}
          </h2>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500 hidden sm:block">Admin Mode</span>
            <div className="border-2 border-transparent hover:border-red-100 rounded-full transition-all p-0.5">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </header>

        {/* Dynamic Page Content (The Outlet) */}
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
        
      </div>

    </div>
  );
}
import { Link, useLocation } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react"; // Added User icon
import axios from "axios";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const { user, isSignedIn, isLoaded } = useUser();
  const location = useLocation();
  const [role, setRole] = useState("user");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isSignedIn && user) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/user/role/${user.id}`)
        .then(res => setRole(res.data.role))
        .catch(() => setRole("user"));
    }
  }, [isSignedIn, user]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  if (!isLoaded) return null;

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Assignments", path: "/assignments" },
    { name: "Downloads", path: "/downloads" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-black/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* 🚀 LOGO */}
          <Link to="/" className="text-orange-500 text-2xl font-black tracking-tighter flex items-center group">
            /-!<span className="text-white text-xs ml-1 font-light opacity-50 group-hover:opacity-100 transition-opacity uppercase tracking-widest">PRO</span>
          </Link>

          {/* 💻 DESKTOP NAVIGATION */}
          <div className="hidden md:flex gap-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-[11px] font-black uppercase tracking-widest transition-all hover:text-orange-500 ${
                  location.pathname === link.path ? "text-orange-500" : "text-gray-400"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {role === "admin" && (
              <Link to="/admin" className="text-[10px] font-black text-orange-500 border border-orange-500/20 px-3 py-1 rounded-md hover:bg-orange-500 hover:text-black transition-all uppercase tracking-tighter">
                Admin Panel
              </Link>
            )}
          </div>

          {/* 🛠️ RIGHT ACTIONS */}
          <div className="flex items-center gap-2 sm:gap-4">
            {isSignedIn && <NotificationBell />}

            <div className="hidden md:flex gap-4 items-center">
              {isSignedIn ? (
                <div className="flex items-center gap-5 border-l border-gray-800 pl-6">
                  <Link to="/profile" className={`text-[11px] font-black uppercase tracking-widest transition hover:text-orange-500 ${location.pathname === "/profile" ? "text-orange-500" : "text-gray-400"}`}>
                    My Profile
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </div>
              ) : (
                <div className="flex gap-4 items-center">
                  <Link to="/login" className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-white">Login</Link>
                  <Link to="/signup" className="bg-orange-500 text-black px-5 py-2 rounded-full text-[11px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-orange-500/10">
                    Join Now
                  </Link>
                </div>
              )}
            </div>

            {/* 📱 MOBILE HAMBURGER */}
            <div className="md:hidden flex items-center gap-2">
              {isSignedIn && <UserButton afterSignOutUrl="/" />}
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-400 hover:text-orange-500 p-2 transition-colors focus:outline-none"
              >
                {isOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 📱 MOBILE NAVIGATION OVERLAY */}
      <div 
        className={`md:hidden absolute top-full left-0 right-0 overflow-hidden transition-all duration-300 ease-in-out bg-black/95 backdrop-blur-lg border-b border-gray-800 z-50 ${
          isOpen ? "max-h-screen opacity-100 visible" : "max-h-0 opacity-0 invisible"
        }`}
      >
        <div className="px-6 pt-4 pb-10 space-y-1">
          <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-4">Menu</p>
          
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block py-4 text-2xl font-black italic tracking-tighter uppercase transition-all ${
                location.pathname === link.path ? "text-orange-500 translate-x-2" : "text-gray-400 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* 🔥 ADDED PROFILE TO MOBILE MENU */}
          {isSignedIn && (
            <Link
              to="/profile"
              className={`block py-4 text-2xl font-black italic tracking-tighter uppercase transition-all border-t border-gray-900 ${
                location.pathname === "/profile" ? "text-orange-500 translate-x-2" : "text-gray-400 hover:text-white"
              }`}
            >
              My Dashboard
            </Link>
          )}
          
          {role === "admin" && (
            <Link to="/admin" className="block py-4 text-2xl font-black italic tracking-tighter uppercase text-orange-400 border-t border-gray-900 mt-4">
              Access Admin
            </Link>
          )}

          {!isSignedIn && (
            <div className="flex flex-col gap-4 mt-8 pt-8 border-t border-gray-800">
              <Link to="/signup" className="w-full text-center py-4 bg-orange-500 text-black font-black uppercase text-sm rounded-2xl">
                Get Started
              </Link>
              <Link to="/login" className="w-full text-center py-4 text-gray-400 font-bold uppercase text-xs tracking-widest border border-gray-800 rounded-2xl">
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
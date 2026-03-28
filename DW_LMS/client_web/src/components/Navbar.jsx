import { Link, useLocation } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Navbar() {
  const { user, isSignedIn } = useUser();
  const location = useLocation();
  const [role, setRole] = useState("user");

  // Fetch role from your MongoDB backend
  useEffect(() => {
    if (user) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/user/role/${user.id}`)
        .then(res => setRole(res.data.role))
        .catch(() => setRole("user"));
    }
  }, [user]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: "Assignments", path: "/assignments" },
    { name: "Downloads", path: "/downloads" },
  ];

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-8 py-4 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <Link to="/" className="text-orange-500 text-2xl font-black tracking-tighter">
        DW<span className="text-white text-sm ml-1 font-light tracking-normal">LMS</span>
      </Link>

      <div className="hidden md:flex gap-8 items-center">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`text-sm font-medium transition-colors hover:text-orange-400 ${
              location.pathname === link.path ? "text-orange-500" : "text-gray-400"
            }`}
          >
            {link.name}
          </Link>
        ))}

        {/* 🔥 ADMIN ONLY LINK */}
        {role === "admin" && (
          <Link to="/admin" className="text-sm font-bold text-orange-400 border border-orange-400/20 px-3 py-1 rounded-md hover:bg-orange-400 hover:text-black transition-all">
            Admin Panel
          </Link>
        )}
      </div>

      <div className="flex gap-4 items-center">
        {isSignedIn ? (
          <div className="flex items-center gap-4">
            <Link to="/profile" className="text-sm text-gray-300 hover:text-white">Profile</Link>
            <UserButton afterSignOutUrl="/" />
          </div>
        ) : (
          <div className="flex gap-4 items-center">
            <Link to="/login" className="text-sm text-gray-300 hover:text-white font-medium">Login</Link>
            <Link to="/signup" className="bg-orange-500 text-black px-4 py-2 rounded-full text-sm font-bold hover:bg-orange-400 transition shadow-lg shadow-orange-500/20">
              Join Now
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
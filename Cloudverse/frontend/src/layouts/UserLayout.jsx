import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function UserLayout() {
  return (
    // min-h-screen ensures the page is always at least the height of the screen
    // flex and flex-col allow us to push the footer to the very bottom
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans text-gray-900">
      
      {/* --- TOP NAVIGATION --- */}
      <Navbar />

      {/* --- MAIN CONTENT AREA --- */}
      {/* flex-grow ensures this area takes up all available space, pushing the footer down */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <Outlet />
      </main>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand Section */}
          <div>
            <h2 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-2">
              <span>🍔</span> Cloudverse
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Delivering happiness to your doorstep. The best food from top restaurants, fast and fresh.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-red-500 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Contact Support</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Partner with us</a></li>
            </ul>
          </div>

          {/* Legal & Location */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm mb-6">
              <li><a href="#" className="hover:text-red-500 transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Refund Policy</a></li>
            </ul>
            <p className="text-sm text-gray-500 font-medium">
              📍 Based in Patna, Bihar 🇮🇳
            </p>
          </div>
          
        </div>

        {/* Copyright Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-sm text-center text-gray-500 flex flex-col sm:flex-row justify-between items-center">
          <p>© {new Date().getFullYear()} Cloudverse. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            {/* Mock Social Icons */}
            <div className="w-8 h-8 rounded-full bg-gray-800 hover:bg-red-600 transition-colors cursor-pointer flex items-center justify-center">X</div>
            <div className="w-8 h-8 rounded-full bg-gray-800 hover:bg-red-600 transition-colors cursor-pointer flex items-center justify-center">in</div>
            <div className="w-8 h-8 rounded-full bg-gray-800 hover:bg-red-600 transition-colors cursor-pointer flex items-center justify-center">ig</div>
          </div>
        </div>
      </footer>

    </div>
  );
}
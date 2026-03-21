import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LEFT SIDE: Logo & Location */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
              <span className="text-3xl">🍔</span>
              <span className="font-extrabold text-3xl tracking-tight text-red-600">
                Cloudverse
              </span>
            </Link>

            {/* Mock Location Selector (Hidden on mobile) */}
            <div className="hidden md:flex items-center gap-2 text-sm cursor-pointer group">
              <svg className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <span className="font-bold text-gray-700 border-b-2 border-gray-700 group-hover:border-red-600 group-hover:text-red-600 transition-colors">
                  Muzaffarpur
                </span>
                <span className="text-gray-500 ml-2">Bihar, India</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Navigation & Auth */}
          <div className="flex items-center gap-6">
            
            {/* If NOT logged in */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-lg font-semibold text-gray-700 hover:text-red-600 transition-colors mr-2">
                  Log In
                </button>
              </SignInButton>
              <SignInButton mode="modal">
                <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-bold transition-colors shadow-md">
                  Sign Up
                </button>
              </SignInButton>
            </SignedOut>

            {/* If IS logged in */}
            <SignedIn>
              {/* Admin Link with Icon */}
              <Link 
                to="/admin" 
                className="hidden sm:flex items-center gap-2 font-semibold text-gray-700 hover:text-red-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Admin
              </Link>

              {/* Cart Link with Icon & Badge */}
              <Link 
                to="/cart" 
                className="flex items-center gap-2 font-semibold text-gray-700 hover:text-red-600 transition-colors relative mr-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span className="hidden sm:block">Cart</span>
                {/* Visual Cart Badge (Can make dynamic later) */}
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  0
                </span>
              </Link>

              {/* Clerk User Profile Avatar */}
              <div className="border-2 border-transparent hover:border-red-100 rounded-full transition-all p-0.5">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>

          </div>
        </div>
      </div>
    </nav>
  );
}
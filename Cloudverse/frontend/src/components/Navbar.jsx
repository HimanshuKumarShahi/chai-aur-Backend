import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useContext(CartContext);
  const { user } = useUser();

  const totalItems = cart?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <nav className="bg-black text-white shadow-md border-b border-gray-800 sticky top-0 z-50 w-full font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LEFT SIDE */}
          <div className="flex items-center gap-4 md:gap-8">
            <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105 active:scale-95">
              <span className="text-2xl md:text-3xl">🍔</span>
              <span className="font-black text-2xl md:text-3xl tracking-tighter text-orange-500">
                CLOUDVERSE
              </span>
            </Link>

            {/* LOCATION */}
            <div className="hidden sm:flex items-center gap-2 text-xs md:text-sm">
              <div className="leading-tight border-l pl-4 border-gray-700">
                <span className="block font-bold text-gray-200">Muzaffarpur</span>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest">Bihar, India</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3 md:gap-6">
            
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-sm md:text-lg font-bold text-gray-300 hover:text-orange-500 transition">
                  Log In
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>

              {/* ADMIN CONTROLS */}
              {isAdmin && (
                <div className="hidden lg:flex items-center gap-4 border-r pr-6 border-gray-700">
                  <Link to="/admin/add-restaurant" className="text-xs font-black uppercase text-gray-400 hover:text-orange-500 transition-colors">
                    + Restaurant
                  </Link>
                  <Link to="/admin/add-food" className="text-xs font-black uppercase text-gray-400 hover:text-orange-500 transition-colors">
                    + Food Item
                  </Link>
                  <Link to="/admin" className="bg-gray-800 p-2 rounded-lg hover:bg-orange-500/20 group transition">
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    </svg>
                  </Link>
                </div>
              )}

              <Link 
                to="/admin" 
                className="hidden sm:flex items-center gap-2 font-semibold text-gray-300 hover:text-orange-500 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.370 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.350 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.370-2.370a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.350a1.724 1.724 0 001.066-2.573c-.940-1.543.826-3.31 2.370-2.370.996.608 2.296.070 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Admin
              </Link>

              {/* CART */}
              <Link to="/cart" className="relative p-2 group">
                <svg className="w-7 h-7 text-gray-300 group-hover:text-orange-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-black text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-black">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* PROFILE */}
              <div className="ml-2 border border-transparent hover:border-orange-500/40 rounded-full transition-all p-0.5">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>

          </div>
        </div>
      </div>
    </nav>
  );
}
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useContext(CartContext);
  const { user } = useUser();

  const totalItems = cart?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <nav className="bg-black/80 backdrop-blur-lg text-white shadow-xl border-b border-white/10 sticky top-0 z-50 w-full font-sans transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* ================= LEFT SIDE: LOGO & LOCATION ================= */}
          <div className="flex items-center gap-4 md:gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="text-2xl md:text-3xl group-hover:rotate-12 transition-transform duration-300">
                🍔
              </span>
              <span className="font-black text-2xl md:text-3xl tracking-tighter bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                CLOUDVERSE
              </span>
            </Link>

            {/* LOCATION BADGE */}
            <div className="hidden sm:flex items-center gap-2 text-xs md:text-sm">
              <div className="leading-tight border-l-2 pl-4 border-orange-500/30">
                <span className="block font-bold text-gray-100 tracking-wide">
                  Muzaffarpur
                </span>
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                  Bihar, India
                </span>
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDE: CONTROLS ================= */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* LOGGED OUT STATE */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="relative overflow-hidden rounded-full bg-white/5 px-6 py-2 text-sm font-bold text-white transition-all hover:bg-orange-500 hover:text-black hover:shadow-[0_0_20px_rgba(249,115,22,0.4)] active:scale-95">
                  Log In
                </button>
              </SignInButton>
            </SignedOut>

            {/* LOGGED IN STATE */}
            <SignedIn>
              {/* ADMIN CONTROLS (Only visible if role is admin) */}
              {isAdmin && (
                <div className="hidden lg:flex items-center gap-3 border-r pr-6 border-white/10">
                  <Link
                    to="/admin/add-restaurant"
                    className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-orange-400 hover:bg-orange-400/10 rounded-md transition-all"
                  >
                    + Restaurant
                  </Link>
                  <Link
                    to="/admin/add-food"
                    className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-orange-400 hover:bg-orange-400/10 rounded-md transition-all"
                  >
                    + Food
                  </Link>
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-gray-300 bg-white/5 rounded-lg hover:bg-orange-500 hover:text-black transition-all shadow-sm"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Dashboard
                  </Link>
                </div>
              )}

              {/* CART ICON */}
              <Link to="/cart" className="relative p-2 group">
                <div className="absolute inset-0 bg-orange-500/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 blur-sm"></div>
                <svg
                  className="relative z-10 w-6 h-6 text-gray-300 group-hover:text-orange-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-br from-orange-400 to-orange-600 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-black shadow-[0_0_10px_rgba(249,115,22,0.5)] transform hover:scale-110 transition-transform">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* CLERK PROFILE COMPONENT */}
              <div className="ml-1 md:ml-3 ring-2 ring-transparent hover:ring-orange-500/50 rounded-full transition-all duration-300">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 border-2 border-white/10",
                    },
                  }}
                />
              </div>
            </SignedIn>
          </div>
        </div>
      </div>
    </nav>
  );
}

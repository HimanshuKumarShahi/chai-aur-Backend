import { Link } from "react-router-dom";
import { UserButton, useUser, SignInButton } from "@clerk/clerk-react";
import { ShoppingCart, Store } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { cart } = useCart();
  const { isSignedIn, user } = useUser();
  
  // Replace with your actual admin email
  const adminEmail = "your.email@gmail.com"; 
  const isAdmin = user?.primaryEmailAddress?.emailAddress === adminEmail;

  return (
    <nav className="bg-blue-600 text-white fixed w-full top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2 italic">
          <Store size={28} />
          ShopVerse
        </Link>

        <div className="flex items-center gap-6 font-semibold">
          {isAdmin && (
            <Link to="/upload" className="hover:text-blue-200 transition">
              Upload Product
            </Link>
          )}

          <div className="relative cursor-pointer flex items-center gap-1 hover:text-blue-200 transition">
            <ShoppingCart size={24} />
            <span>Cart</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -left-3 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </div>

          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton mode="modal">
              <button className="bg-white text-blue-600 px-4 py-1 rounded-sm shadow hover:bg-gray-100 transition">
                Login
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
}
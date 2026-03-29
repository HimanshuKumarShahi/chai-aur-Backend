import { useEffect, useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import axios from "axios";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ShieldAlert, LogOut, Loader2 } from "lucide-react";

export default function Layout({ children }) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [isBlocked, setIsBlocked] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (user) {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/${user.id}`);
          if (res.data && res.data.isBlocked) {
            setIsBlocked(true);
          }
        } catch (err) {
          console.error("Status Check Error:", err);
        } finally {
          setCheckingStatus(false);
        }
      } else {
        setCheckingStatus(false);
      }
    };

    if (isLoaded) checkUserStatus();
  }, [user, isLoaded]);

  // 🛡️ 1. LOCKOUT SCREEN (Shows if user is banned)
  if (isBlocked) {
    return (
      <div className="fixed inset-0 bg-[#050505] z-[9999] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <ShieldAlert size={48} className="text-red-500" />
        </div>
        <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-3">
          Access <span className="text-red-500">Revoked.</span>
        </h1>
        <p className="text-gray-500 max-w-md mb-8 leading-relaxed font-medium">
          Your account has been restricted by the system administrator. You can no longer access courses, 
          downloads, or modify your profile data.
        </p>
        <button 
          onClick={() => signOut()}
          className="flex items-center gap-3 bg-white text-black px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all shadow-2xl"
        >
          <LogOut size={18} /> Sign Out of Terminal
        </button>
      </div>
    );
  }

  // ⌛ 2. LOADING STATE
  if (!isLoaded || checkingStatus) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="text-orange-500 animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
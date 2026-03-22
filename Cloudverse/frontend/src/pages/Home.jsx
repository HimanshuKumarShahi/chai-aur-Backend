import { useEffect, useState, Suspense, useRef } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, Star, Clock, Zap, MapPin, Trophy, Percent, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ErrorBoundary } from "react-error-boundary";
import Spline from '@splinetool/react-spline';

// --- 1. PREMIUM ERROR FALLBACK (Prevents White Screen) ---
const HeroErrorFallback = () => (
  <div className="w-full h-full bg-gradient-to-br from-slate-900 to-black rounded-[4rem] flex flex-col items-center justify-center p-12 text-center border-[12px] border-white shadow-2xl">
    <div className="bg-orange-500/20 p-6 rounded-full mb-6">
      <Zap size={48} className="text-orange-500 animate-pulse" />
    </div>
    <h3 className="text-white text-3xl font-black italic tracking-tighter">ENGINE ASLEEP</h3>
    <p className="text-slate-400 font-bold text-sm mt-2 max-w-xs">The 3D view is resting, but our kitchens are wide awake!</p>
    <button onClick={() => window.location.reload()} className="mt-8 bg-orange-600 text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 transition-all">
      Wake Up Engine
    </button>
  </div>
);

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isLoaded, setIsLoaded] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    // Wrap fetch in try-catch to prevent data errors from causing white screens
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/restaurants");
        const data = await res.json();
        if (data) {
          setRestaurants(data);
          setFilteredList(data);
        }
      } catch (err) {
        console.error("Data Fetch Error:", err);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!restaurants.length) return;
    let result = [...restaurants];
    if (searchTerm) {
      result = result.filter(r => r.name?.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (activeFilter === "topmost") result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (activeFilter === "offers") result = result.filter(r => r.hasOffer);
    setFilteredList(result);
  }, [searchTerm, activeFilter, restaurants]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 overflow-x-hidden">
      
      {/* --- HERO SECTION --- */}
      <section className="max-w-7xl mx-auto px-8 pt-24 pb-20 grid lg:grid-cols-2 gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-8 border border-slate-100">
            <span className="h-2 w-2 bg-green-500 rounded-full animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live in Muzaffarpur</span>
          </div>
          <h2 className="text-8xl xl:text-9xl font-black leading-[0.85] tracking-tighter mb-8">
            Digital <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-600 italic">Cravings.</span>
          </h2>
          <button 
            onClick={() => menuRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-lg shadow-2xl hover:bg-orange-600 transition-all"
          >
            Explore Menu
          </button>
        </motion.div>

        {/* 3D MODEL WITH SAFETY BOUNDARY */}
        <div className="h-[550px] relative hidden lg:block group">
          <div className="absolute inset-0 bg-orange-500/10 blur-[100px] rounded-full -z-10" />
          <ErrorBoundary FallbackComponent={HeroErrorFallback}>
            <Suspense fallback={<div className="w-full h-full bg-slate-100 rounded-[4rem] flex items-center justify-center"><Loader2 className="animate-spin text-orange-500" /></div>}>
              <div className="w-full h-full rounded-[4rem] overflow-hidden border-[12px] border-white shadow-2xl bg-white relative">
                <Spline scene="https://prod.spline.design/6Wq1Q7YKVpM-pT86/scene.splinecode" />
              </div>
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>

      {/* --- STICKY SEARCH BAR --- */}
      <div ref={menuRef} className="sticky top-6 z-50 px-8 mb-16">
        <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-3xl border border-white rounded-[2.5rem] p-3 shadow-2xl flex flex-col lg:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
            <input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search nearest legends..." 
              className="w-full bg-slate-50 border-none rounded-[2rem] py-5 pl-16 pr-6 outline-none font-bold text-sm shadow-inner transition-all focus:bg-white"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto w-full lg:w-auto scrollbar-hide py-1">
            {[{ id: 'all', label: 'All', icon: <MapPin size={14}/> }, { id: 'topmost', label: 'Top Rated', icon: <Trophy size={14}/> }, { id: 'offers', label: 'Offers', icon: <Percent size={14}/> }].map(f => (
              <button 
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`flex items-center gap-2 px-8 py-4 rounded-[1.8rem] font-black text-[10px] uppercase tracking-widest transition-all
                ${activeFilter === f.id ? 'bg-orange-500 text-white shadow-lg' : 'bg-white text-slate-400 hover:text-slate-900'}`}
              >
                {f.icon} {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- RESTAURANT GRID --- */}
      <main className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {!isLoaded ? (
            [1, 2, 3].map(i => <div key={i} className="h-[500px] rounded-[4rem] bg-slate-200 animate-pulse" />)
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredList.map((r) => (
                <motion.div
                  layout
                  key={r._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -15, rotate: 1 }}
                  className="group relative h-[520px] rounded-[4rem] overflow-hidden border-[8px] border-white shadow-2xl transition-all duration-700 bg-slate-100"
                >
                  <Link to={`/restaurant/${r._id}`}>
                    <img src={r.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent" />
                    <div className="absolute bottom-12 left-12 right-12 text-white">
                      <div className="flex items-center gap-2 mb-4">
                        <Star size={16} fill="#f97316" className="text-orange-500" />
                        <span className="font-black text-xl tracking-tighter">4.9</span>
                      </div>
                      <h4 className="text-5xl font-black mb-4 tracking-tighter leading-[0.9] group-hover:text-orange-400 transition-colors">{r.name}</h4>
                      <p className="font-bold text-[10px] uppercase tracking-[0.2em] opacity-40">Muzaffarpur • 20 MIN</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </main>
    </div>
  );
}
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CartContext } from "../context/CartContext";
import BackButton from "../components/BackButton";
import { Star, Clock, ShoppingBag, Leaf, Flame, ArrowUpDown, Coffee, Utensils, Zap, MapPin } from "lucide-react";
import { ErrorBoundary } from "react-error-boundary";

const Spline = lazy(() => import('@splinetool/react-spline'));

const HeaderFallback = ({ image, name }) => (
  <div className="relative h-full w-full bg-slate-900 flex items-center justify-center">
    {image && <img src={image} className="absolute inset-0 w-full h-full object-cover opacity-30 blur-md" alt={name} />}
    <Zap size={32} className="text-orange-500 animate-pulse" />
  </div>
);

export default function Restaurant() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/restaurants");
        const data = await res.json();
        const current = data.find(r => r._id === id);
        if (isMounted && current) {
          setRestaurant(current);
          const fRes = await fetch(`http://localhost:5000/api/food/restaurant/${id}`);
          setFoods(await fRes.json());
        }
      } catch (e) { console.error(e); }
      finally { if (isMounted) setIsLoading(false); }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [id]);

  useEffect(() => {
    let result = [...foods];
    if (activeTab === "food") result = result.filter(i => !i.isDrink);
    if (activeTab === "drinks") result = result.filter(i => i.isDrink);
    if (sortOrder === "low") result.sort((a, b) => a.price - b.price);
    if (sortOrder === "high") result.sort((a, b) => b.price - a.price);
    setFilteredFoods(result);
  }, [activeTab, sortOrder, foods]);

  if (isLoading) return <div className="h-screen flex items-center justify-center font-black text-orange-500 uppercase">Syncing...</div>;

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-32">
      
      {/* --- FIXED BACK BUTTON POSITION FIX --- */}
      {/* Using 'left-4 md:left-10' and 'top-4 md:top-8' ensures 
          it doesn't hug the edge too tight on mobile.
      */}
      <div className="fixed top-4 left-4 md:top-8 md:left-10 z-[200]">
        <div className="bg-white/80 backdrop-blur-md p-1 rounded-2xl shadow-xl border border-white">
          <BackButton />
        </div>
      </div>

      {/* --- HERO HEADER --- */}
      <div className="relative h-[400px] md:h-[500px] w-full bg-slate-100 overflow-hidden shadow-2xl">
        <ErrorBoundary FallbackComponent={() => <HeaderFallback image={restaurant?.image} name={restaurant?.name} />}>
          <Suspense fallback={<HeaderFallback image={restaurant?.image} name={restaurant?.name} />}>
            <div className="w-full h-full border-b-[12px] border-white">
              <Spline scene="https://prod.spline.design/6Wq1Q7YKVpM-pT86/scene.splinecode" />
            </div>
          </Suspense>
        </ErrorBoundary>

        <div className="absolute bottom-0 inset-x-0 p-6 md:p-12 bg-gradient-to-t from-white via-white/20 to-transparent z-20">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-slate-900 leading-none">
              {restaurant?.name}
            </h1>
          </div>
        </div>
      </div>

      {/* --- STICKY FILTERS --- */}
      <div className="sticky top-0 z-[100] bg-white/80 backdrop-blur-3xl border-b border-slate-100 py-4 md:py-6">
        <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex bg-slate-100 p-1 rounded-2xl w-full md:w-auto">
            {['all', 'food', 'drinks'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all
                ${activeTab === tab ? 'bg-white text-orange-600 shadow-md' : 'text-slate-400'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <button 
              onClick={() => setSortOrder(sortOrder === "low" ? "default" : "low")}
              className={`flex-1 md:flex-none px-4 py-2.5 rounded-xl border-2 font-black text-[10px] uppercase transition-all 
              ${sortOrder === "low" ? "border-orange-500 bg-orange-50 text-orange-600" : "border-slate-100 text-slate-400"}`}
            >
              Price: Low-High
            </button>
          </div>
        </div>
      </div>

      {/* --- MENU LIST --- */}
      <main className="max-w-6xl mx-auto px-4 md:px-8 mt-10">
        <div className="grid grid-cols-1 gap-6 md:gap-10">
          <AnimatePresence mode="popLayout">
            {filteredFoods.map((item) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={item._id}
                className="group bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10 border-[4px] md:border-[6px] border-white shadow-xl flex flex-col md:flex-row items-center gap-6 md:gap-12"
              >
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl md:text-4xl font-black text-slate-800 tracking-tighter mb-2">{item.name}</h3>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6 line-clamp-2">{item.description}</p>
                  <span className="text-3xl md:text-4xl font-black text-slate-900 italic tracking-tighter leading-none">₹{item.price}</span>
                </div>

                <div className="relative w-full md:w-56 h-56 rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-slate-50">
                  <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => addToCart(item)}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase shadow-2xl hover:bg-orange-600 transition-colors"
                  >
                    Add
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
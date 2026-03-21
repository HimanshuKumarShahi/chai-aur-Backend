import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingBag, Star, Clock, Plus, Minus, ChevronRight, X } from "lucide-react";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showVegOnly, setShowVegOnly] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  // Real-App Cart State
  const [cart, setCart] = useState({}); // { restaurantId: quantity }
  const [lastAdded, setLastAdded] = useState(null);

  const categories = [
    { name: "All", emoji: "🏠" },
    { name: "Pizza", emoji: "🍕" },
    { name: "Burger", emoji: "🍔" },
    { name: "Biryani", emoji: "🍗" },
    { name: "Healthy", emoji: "🥗" },
    { name: "Desserts", emoji: "🍰" },
    { name: "Chinese", emoji: "🍜" }
  ];

  useEffect(() => {
    // Simulated API Fetch
    fetch("http://localhost:5000/api/restaurants")
      .then(res => res.json())
      .then(data => {
        setRestaurants(data);
        setFilteredRestaurants(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  // Composite Filter Logic
  useEffect(() => {
    let result = [...restaurants];
    if (searchTerm) {
      result = result.filter(r => r.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (activeCategory !== "All") {
      result = result.filter(r => r.cuisine?.some(c => c.toLowerCase().includes(activeCategory.toLowerCase())));
    }
    if (showVegOnly) result = result.filter(r => r.isVeg);
    if (sortBy === "lowToHigh") result.sort((a, b) => a.avgPrice - b.avgPrice);
    if (sortBy === "highToLow") result.sort((a, b) => b.avgPrice - a.avgPrice);
    setFilteredRestaurants(result);
  }, [searchTerm, activeCategory, showVegOnly, sortBy, restaurants]);

  // Realistic Cart Functions
  const updateCart = (id, delta, name) => {
    setCart(prev => {
      const newQty = (prev[id] || 0) + delta;
      if (newQty <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: newQty };
    });
    if (delta > 0) {
      setLastAdded(name);
      setTimeout(() => setLastAdded(null), 2000);
    }
  };

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-slate-50 pb-32">
      {/* --- STICKY HEADER --- */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span className="bg-orange-500 text-white p-1 rounded-lg">CV</span>
              Cloudverse <span className="text-orange-500 hidden sm:inline">Muzaffarpur</span>
            </h1>
          </div>
          
          <div className="relative w-1/3 max-w-sm hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search for food..." 
              className="w-full bg-slate-100 border-none rounded-xl py-2 pl-10 focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
             <button className="p-2 hover:bg-slate-100 rounded-full transition-colors relative">
                <ShoppingBag size={22} className="text-slate-700" />
                {cartCount > 0 && <span className="absolute top-0 right-0 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 mt-8">
        {/* --- CATEGORY PILLS --- */}
        <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap font-bold text-sm transition-all border
                ${activeCategory === cat.name ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-400'}`}
            >
              <span>{cat.emoji}</span> {cat.name}
            </button>
          ))}
        </div>

        {/* --- RESTAURANT GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-4">
          {isLoading ? (
            [...Array(8)].map((_, i) => <div key={i} className="h-64 bg-white rounded-3xl animate-pulse" />)
          ) : (
            filteredRestaurants.map(r => (
              <div key={r._id} className="group bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500">
                <Link to={`/restaurant/${r._id}`} className="block relative h-48 overflow-hidden">
                  <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <Star size={12} className="text-orange-500" fill="currentColor" />
                    <span className="text-xs font-black">4.2</span>
                  </div>
                  {r.isVeg && <div className="absolute top-4 right-4 w-4 h-4 bg-white border border-green-600 flex items-center justify-center p-0.5 rounded-sm"><div className="w-full h-full bg-green-600 rounded-full" /></div>}
                </Link>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-slate-900 text-lg truncate">{r.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-bold mb-4 uppercase tracking-wider">
                    <Clock size={12} /> 25-35 MINS • ₹{r.avgPrice} for two
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex flex-col">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Popular</p>
                        <p className="text-sm font-black text-slate-800">Pizza & More</p>
                    </div>

                    {/* REAL-APP QTY TOGGLE */}
                    {cart[r._id] ? (
                      <div className="flex items-center gap-3 bg-orange-600 text-white px-3 py-1.5 rounded-xl shadow-lg shadow-orange-200 animate-in zoom-in-90">
                        <button onClick={() => updateCart(r._id, -1, r.name)}><Minus size={16} /></button>
                        <span className="font-black text-sm w-4 text-center">{cart[r._id]}</span>
                        <button onClick={() => updateCart(r._id, 1, r.name)}><Plus size={16} /></button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => updateCart(r._id, 1, r.name)}
                        className="bg-slate-50 text-orange-600 px-6 py-2 rounded-xl font-black text-xs hover:bg-orange-600 hover:text-white transition-all active:scale-95 border border-orange-100"
                      >
                        ADD
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* --- REALISTIC FLOATING CART BAR --- */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] w-[92%] max-w-lg">
          <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/10 animate-slide-up">
            <div className="flex items-center gap-4">
              <div className="relative">
                <ShoppingBag size={24} className="text-orange-500" />
                <span className="absolute -top-2 -right-2 bg-white text-slate-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Added {lastAdded || 'Items'}</p>
                <p className="font-black text-sm">View your basket</p>
              </div>
            </div>
            
            <Link to="/cart" className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 px-5 py-2.5 rounded-xl transition-colors">
              <span className="text-sm font-black uppercase">Next</span>
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
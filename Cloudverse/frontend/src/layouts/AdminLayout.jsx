import { useEffect, useState, useCallback } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { UserButton, useAuth } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  Store, 
  PlusCircle, 
  ArrowLeft, 
  Zap, 
  TrendingUp, 
  ShoppingBag, 
  RefreshCcw 
} from "lucide-react";

export default function AdminLayout() {
  const location = useLocation();
  const { getToken } = useAuth();
  
  const [stats, setStats] = useState({ totalOrders: 0, revenue: 0 });
  const [isSyncing, setIsSyncing] = useState(false);

  const fetchStats = useCallback(async () => {
    setIsSyncing(true);
    try {
      const token = await getToken();
      const res = await fetch("http://localhost:5000/api/orders/admin/stats", {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (!res.ok) throw new Error("Sync failed");
      const data = await res.json();
      
      setStats({
        totalOrders: Number(data.totalOrders) || 0,
        revenue: Number(data.totalRevenue) || 0
      });
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    } finally {
      setTimeout(() => setIsSyncing(false), 600);
    }
  }, [getToken]);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  useEffect(() => {
    fetchStats();
  }, [location.pathname, fetchStats]);

  const getLinkStyle = (path) => {
    const isActive = location.pathname === path;
    return `flex items-center gap-3 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all border-r-4 ${
      isActive 
        ? "border-orange-500 bg-orange-500/10 text-orange-500 shadow-[inset_-10px_0_20px_rgba(249,115,22,0.1)]" 
        : "border-transparent text-slate-400 hover:text-white hover:bg-white/5"
    }`;
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-orange-500 selection:text-white overflow-hidden">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-[#0a0a0a] border-r border-white/5 flex flex-col z-30 hidden lg:flex">
        <div className="h-24 flex items-center px-8 mb-8">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-600/20 group-hover:rotate-12 transition-transform">
              <Zap className="text-white fill-white" size={20} />
            </div>
            <span className="font-black text-xl tracking-tighter text-white italic">
              CLOUD<span className="text-orange-600">ADMIN</span>
            </span>
          </Link>
        </div>

        {/* Live Metrics Block - High Visibility */}
        <div className="px-6 mb-10 space-y-3">
          <motion.div 
            animate={isSyncing ? { opacity: [1, 0.5, 1], scale: [1, 0.98, 1] } : {}}
            className="bg-orange-600 p-5 rounded-[2rem] border border-orange-400/20 shadow-[0_10px_30px_rgba(234,88,12,0.2)]"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-black uppercase text-orange-100 tracking-widest">Revenue</p>
              <TrendingUp size={14} className="text-white" />
            </div>
            <p className="text-3xl font-black text-white italic">₹{stats.revenue.toLocaleString()}</p>
          </motion.div>

          <div className="bg-[#111] p-5 rounded-[2rem] border border-white/5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Live Orders</p>
              <ShoppingBag size={14} className="text-orange-500" />
            </div>
            <p className="text-3xl font-black text-white italic">{stats.totalOrders}</p>
          </div>

          <button 
            onClick={fetchStats}
            disabled={isSyncing}
            className="w-full flex items-center justify-center gap-2 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-orange-500 transition-colors disabled:opacity-50"
          >
            <RefreshCcw size={10} className={isSyncing ? "animate-spin" : ""} />
            {isSyncing ? "Syncing..." : "Manual Refresh"}
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          <p className="px-8 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-4">Command Center</p>
          <Link to="/admin" className={getLinkStyle('/admin')}>
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link to="/admin/add-restaurant" className={getLinkStyle('/admin/add-restaurant')}>
            <Store size={18} /> Add Restaurant
          </Link>
          <Link to="/admin/add-food" className={getLinkStyle('/admin/add-food')}>
            <PlusCircle size={18} /> Add Food Item
          </Link>
        </nav>

        <div className="p-6">
          <Link to="/" className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-[#111] text-xs font-black uppercase tracking-widest text-slate-300 hover:bg-orange-600 hover:text-black transition-all group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to App
          </Link>
        </div>
      </aside>

      {/* --- MAIN INTERFACE --- */}
      <div className="flex-1 flex flex-col relative overflow-y-hidden">
        
        {/* Spatial Background Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-600/10 blur-[150px] rounded-full pointer-events-none" />

        <header className="h-24 bg-[#050505]/90 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between px-10 z-20">
          <div>
            <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">
              {location.pathname === "/admin" ? "Neural Overview" : location.pathname.split('/').pop().replace('-', ' ')}
            </h2>
            <p className="text-[10px] font-black text-orange-500 uppercase tracking-[0.4em] mt-2">Terminal Active</p>
          </div>
          
          <div className="flex items-center gap-8">
            {/* Improved User Visibility Section */}
            <div className="hidden md:flex flex-col items-end leading-none">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated Admin</span>
              <span className="text-sm font-bold text-white tracking-tight">Kumar System</span>
            </div>
            
            <div className="p-1 rounded-2xl bg-white/10 border border-white/20 hover:border-orange-500/50 transition-all shadow-lg">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 relative z-10 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet context={{ fetchStats }} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #050505; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #222; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #f97316; }
      `}} />
    </div>
  );
}
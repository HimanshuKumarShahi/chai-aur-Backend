import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Rocket, ShieldCheck, Zap, ChevronRight } from "lucide-react";

export default function WelcomeModal({ isOpen, onClose, userName }) {
  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1, delayChildren: 0.2 }
    },
    exit: { opacity: 0, scale: 0.9, y: 20 }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          {/* 🌑 Cinematic Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/95 backdrop-blur-md"
          />

          {/* ⚡ Modal Card */}
          <motion.div
            variants={containerVars}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-lg bg-[#050505] border border-white/10 rounded-[3.5rem] p-8 md:p-14 overflow-hidden shadow-[0_0_100px_rgba(249,115,22,0.15)] text-center"
          >
            {/* 🏁 Background Texture: Tech Grid */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                 style={{ backgroundImage: `radial-gradient(#fff 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
            
            {/* 🟠 Corner Glows */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-orange-600/20 blur-[100px] rounded-full" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-orange-900/10 blur-[100px] rounded-full" />
            
            <div className="relative">
              {/* --- 1. ICON LOGO --- */}
              <motion.div 
                variants={itemVars}
                className="w-24 h-24 bg-gradient-to-br from-orange-500/20 to-transparent border border-orange-500/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-[0_0_40px_rgba(249,115,22,0.1)] rotate-6"
              >
                <Sparkles size={48} className="text-orange-500 animate-pulse" />
              </motion.div>

              {/* --- 2. HEADER TEXT --- */}
              <motion.div variants={itemVars} className="space-y-2 mb-8">
                <h2 className="text-[10px] font-black uppercase tracking-[0.6em] text-orange-500/50">
                  Access Granted // Welcome Scholar
                </h2>
                <h1 className="text-5xl md:text-6xl font-black text-white italic tracking-tighter leading-none">
                   <span className="text-orange-500">/-!</span>PRO
                </h1>
              </motion.div>

              {/* --- 3. PERSONAL MESSAGE --- */}
              <motion.p variants={itemVars} className="text-gray-400 text-sm md:text-base leading-relaxed mb-12 max-w-sm mx-auto">
                Identity confirmed: <span className="text-white font-bold tracking-tight">{userName?.split(' ')[0]}</span>. 
                Your clearance is active. You are now authorized to explore the terminal.
              </motion.p>

              {/* --- 4. FEATURE BADGES --- */}
              <motion.div variants={itemVars} className="grid grid-cols-3 gap-4 mb-12">
                 {[
                   { icon: <Rocket size={20}/>, label: "Deploy" },
                   { icon: <ShieldCheck size={20}/>, label: "Secure" },
                   { icon: <Zap size={20}/>, label: "Execute" }
                 ].map((item, i) => (
                   <div key={i} className="group p-4 bg-white/[0.03] rounded-[1.5rem] border border-white/5 hover:border-orange-500/30 transition-all duration-500 flex flex-col items-center gap-3">
                      <div className="text-gray-500 group-hover:text-orange-500 group-hover:scale-110 transition-all">{item.icon}</div>
                      <span className="text-[8px] font-black uppercase text-gray-600 tracking-[0.2em] group-hover:text-white transition-colors">{item.label}</span>
                   </div>
                 ))}
              </motion.div>

              {/* --- 5. ACTION BUTTON --- */}
              <motion.button 
                variants={itemVars}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="group relative w-full overflow-hidden py-6 bg-white text-black font-black uppercase text-[11px] tracking-[0.3em] rounded-[1.8rem] shadow-2xl transition-all"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Initialize Dashboard <ChevronRight size={16} strokeWidth={3} />
                </span>
                {/* Button Hover Shine */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
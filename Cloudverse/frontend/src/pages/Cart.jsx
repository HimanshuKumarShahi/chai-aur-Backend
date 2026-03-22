import { useState, useContext, useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CreditCard, Smartphone, Landmark, ShieldCheck, 
  Timer, Loader2, MapPin, Plus, Minus, 
  ShoppingBag, Sparkles, ChevronRight, Zap
} from "lucide-react";

export default function Cart() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  
  const cartContext = useContext(CartContext);
  const cart = cartContext?.cart || [];
  const { clearCart, increaseQuantity, decreaseQuantity } = cartContext;
  
  const [address, setAddress] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentStep, setPaymentStep] = useState("idle");
  const [timeLeft, setTimeLeft] = useState(239);

  // --- CALCULATIONS ---
  const itemTotal = cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0);
  const deliveryFee = itemTotal > 0 ? (itemTotal < 500 ? 40 : 0) : 0;
  const taxes = itemTotal * 0.05; 
  const grandTotal = itemTotal + deliveryFee + taxes;

  const paymentMethods = [
    { id: 'upi', icon: <Smartphone />, label: 'UPI / QR', desc: 'GPay, PhonePe' },
    { id: 'card', icon: <CreditCard />, label: 'Cards', desc: 'Visa, Master' },
    { id: 'net', icon: <Landmark />, label: 'Banking', desc: 'Net Banking' }
  ];

  useEffect(() => {
    let timer;
    if (paymentStep === "scanning" && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [paymentStep, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartPayment = () => {
    if (!address.trim()) return alert("📍 Enter delivery location!");
    if (!selectedMethod) return alert("💳 Select a payment method!");
    setPaymentStep("processing");
    setTimeout(() => setPaymentStep("scanning"), 2500);
  };

  const finalizeOrder = async () => {
    try {
      const token = await getToken();
      const response = await fetch("http://localhost:5000/api/orders/place", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          clerkUserId: user?.id,
          items: cart.map(item => ({ foodItem: item._id, quantity: item.quantity, price: item.price })),
          totalAmount: grandTotal,
          deliveryAddress: address
        })
      });

      if (response.ok) {
        setPaymentStep("success");
        setTimeout(() => { clearCart(); navigate("/"); }, 7000); // Slightly longer delay for GIF
      }
    } catch (error) { setPaymentStep("idle"); }
  };

  // --- EMPTY STATE GUARD ---
  if (cart.length === 0 && paymentStep === "idle") {
    return (
      <div className="min-h-screen bg-[#FDFDFF] flex flex-col items-center justify-center p-8">
        <div className="bg-white border-[12px] border-white shadow-2xl rounded-[4rem] p-16 flex flex-col items-center max-w-md text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-orange-500/5 blur-3xl rounded-full" />
          <div className="relative z-10">
            <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-8 mx-auto"><ShoppingBag size={48} className="text-slate-200" /></div>
            <h2 className="text-5xl font-black tracking-tighter text-slate-900 leading-none">EMPTY <br/><span className="text-orange-500 italic">CART.</span></h2>
            <p className="text-slate-400 font-bold text-sm mt-6 uppercase tracking-widest">Nothing to checkout yet!</p>
            <Link to="/" className="mt-10 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all">Go Shop</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] pb-40 selection:bg-orange-100">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        <header className="mb-12">
          <h1 className="text-7xl font-black tracking-tighter italic text-slate-900 leading-none">CHECK<span className="text-orange-600">OUT.</span></h1>
          <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mt-4 flex items-center gap-2">
            <Zap size={12} className="text-orange-500" /> Secure Cloudverse Gateway v2.0
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* --- LEFT: DETAILS & PAYMENTS --- */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* 1. Items Section */}
            <section className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-8 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> Selected Items
              </h2>
              <div className="space-y-6">
                {cart.map((item) => (
                  <motion.div layout key={item._id} className="flex items-center gap-6 group">
                    <img src={item.image} className="w-20 h-20 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform" alt="" />
                    <div className="flex-1">
                      <h4 className="font-black text-lg text-slate-800 tracking-tight leading-tight">{item.name}</h4>
                      <p className="text-orange-500 font-black text-xs italic mt-1">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-slate-50 p-1.5 rounded-xl border border-slate-100 shadow-inner">
                      <button onClick={() => decreaseQuantity(item._id)} className="p-1.5 hover:bg-white rounded-lg transition-all"><Minus size={12}/></button>
                      <span className="font-black text-xs w-4 text-center">{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item._id)} className="p-1.5 hover:bg-white rounded-lg transition-all"><Plus size={12}/></button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* 2. Address Section */}
            <section className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm">
               <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-6 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> Delivery Point
               </h2>
               <div className="flex gap-4">
                  <div className="bg-orange-50 p-4 rounded-3xl h-fit text-orange-500"><MapPin size={24}/></div>
                  <textarea 
                    className="flex-1 bg-transparent p-2 text-lg font-bold placeholder:text-slate-200 outline-none resize-none"
                    placeholder="Enter your street address in Muzaffarpur..."
                    rows="2"
                    value={address} onChange={e => setAddress(e.target.value)}
                  />
               </div>
            </section>

            {/* 3. Payment Options */}
            <section className="space-y-6">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 flex items-center gap-2 px-4">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" /> Choose Payment Method
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {paymentMethods.map(m => (
                  <button 
                    key={m.id}
                    onClick={() => setSelectedMethod(m.id)}
                    className={`p-6 rounded-[2.5rem] border-4 transition-all text-left flex flex-col gap-4 relative overflow-hidden group
                    ${selectedMethod === m.id ? 'border-orange-500 bg-white shadow-2xl scale-[1.02]' : 'border-white bg-white hover:border-slate-100 shadow-sm'}`}
                  >
                    <div className={`${selectedMethod === m.id ? 'text-orange-500' : 'text-slate-300'} group-hover:scale-110 transition-transform`}>{m.icon}</div>
                    <div>
                      <p className="font-black text-sm uppercase tracking-widest text-slate-800">{m.label}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1">{m.desc}</p>
                    </div>
                    {selectedMethod === m.id && (
                      <motion.div layoutId="payment_glow" className="absolute top-0 right-0 w-10 h-10 bg-orange-500 rounded-bl-[1.5rem] flex items-center justify-center text-white">
                        <Sparkles size={14}/>
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </section>
          </div>

          {/* --- RIGHT: STICKY SUMMARY --- */}
          <div className="lg:col-span-5">
            <div className="sticky top-32 bg-slate-900 p-10 rounded-[4rem] text-white shadow-2xl border-[10px] border-white overflow-hidden relative">
               <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 blur-3xl rounded-full" />
               <h3 className="text-2xl font-black tracking-tighter mb-10 italic uppercase relative z-10">Order <span className="text-orange-500">Value</span></h3>
               
               <div className="space-y-6 text-sm font-black uppercase tracking-widest text-slate-500 mb-10 border-b border-white/5 pb-10 relative z-10">
                 <div className="flex justify-between"><span>Items Subtotal</span><span className="text-white">₹{itemTotal}</span></div>
                 <div className="flex justify-between"><span>Delivery</span><span className="text-green-400">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span></div>
                 <div className="flex justify-between"><span>Tax (GST)</span><span className="text-white">₹{taxes.toFixed(0)}</span></div>
               </div>

               <div className="mb-10 relative z-10">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Total to Pay</p>
                  <h2 className="text-6xl font-black tracking-tighter text-white leading-none mt-2">₹{grandTotal.toFixed(0)}</h2>
               </div>

               <button 
                 onClick={handleStartPayment}
                 disabled={cart.length === 0}
                 className="w-full bg-orange-600 text-white py-6 rounded-[2.5rem] font-black text-sm uppercase tracking-widest hover:bg-white hover:text-slate-900 transition-all shadow-2xl active:scale-95 disabled:opacity-50 relative z-10"
               >
                 <ShieldCheck className="inline-block mr-2" size={16}/> Authorize Payment
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- PAYMENT OVERLAYS --- */}
      <AnimatePresence>
        {paymentStep === "processing" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-white/90 backdrop-blur-2xl z-[300] flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-orange-600 mb-6" size={60} strokeWidth={3} />
            <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900">Configuring Gateway</h2>
            <p className="text-slate-400 font-bold mt-2">Connecting Muzaffarpur Hub...</p>
          </motion.div>
        )}

        {paymentStep === "scanning" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 bg-slate-950 z-[310] flex flex-col items-center justify-center p-8">
            <div className="bg-white p-10 rounded-[3.8rem] relative overflow-hidden shadow-[0_0_80px_rgba(249,115,22,0.2)]">
               <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=CV_${grandTotal}`} alt="QR" className="w-64 h-64 grayscale" />
               <div className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_20px_#22c55e] animate-scan-line"></div>
            </div>
            <div className="mt-12 text-center">
              <div className="text-orange-500 text-5xl font-black mb-8 font-mono tracking-tighter">{formatTime(timeLeft)}</div>
              <button onClick={finalizeOrder} className="bg-white text-black px-12 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">I Have Scanned ✅</button>
            </div>
          </motion.div>
        )}

        {/* --- 1. THE CORRECTED "FULL-VIEW" SUCCESS STATE --- */}
        {paymentStep === "success" && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="fixed inset-0 bg-[#FAFAFA] z-[400] flex flex-col items-center justify-center p-6 text-center overflow-hidden"
          >
            {/* Optimized Image Container: Prevents Cropping */}
            <motion.div 
              initial={{ y: 50, scale: 0.9 }} 
              animate={{ y: 0, scale: 1 }} 
              transition={{ type: "spring", delay: 0.2 }}
              className="w-full max-w-lg aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-[10px] border-white bg-white mb-12 flex items-center justify-center p-4"
            >
              {/* object-contain ensures the full GIF fits without cutting off */}
              <img 
                src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmVpaHdpbmFhdHYxZ2VpbDZpN2djZTJ3cjl5ZGs5MHFzb2kwYzRveSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Rfwlp9c5bA7R3s7Y5D/giphy.gif" 
                className="w-full h-full object-contain" 
                alt="Payment Success" 
              />
            </motion.div>

            <h1 className="text-7xl font-black italic tracking-tighter text-slate-950 leading-none mb-4">PAISA VASOOL!</h1>
            <p className="text-xl font-bold text-slate-500">Cloudverse Order CV-{Math.floor(Math.random() * 90000) + 10000} Confirmed.</p>
            <p className="text-slate-400 font-medium text-sm mt-2 max-w-md mx-auto">Our kitchens are preparing magic. Rider will speed towards your location shortly!</p>

            <div className="mt-16 inline-flex items-center gap-3 bg-orange-50 text-orange-600 px-8 py-3.5 rounded-full font-black text-xs uppercase tracking-widest border border-orange-100">
               <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping" />
               Navigating back to menu...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan-line { 0%, 100% { top: 0; } 50% { top: 100%; } }
        .animate-scan-line { animation: scan-line 2.5s ease-in-out infinite; position: absolute; }
      `}} />
    </div>
  );
}
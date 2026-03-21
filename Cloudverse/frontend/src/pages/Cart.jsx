import { useState, useContext, useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { CreditCard, Smartphone, Landmark, ShieldCheck, Timer, Loader2 } from "lucide-react";

export default function Cart() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const { cart, clearCart, increaseQuantity, decreaseQuantity } = useContext(CartContext);
  
  const [address, setAddress] = useState("");
  const [selectedMethod, setSelectedMethod] = useState(null);
  
  // idle -> processing -> scanning -> success
  const [paymentStep, setPaymentStep] = useState("idle");
  const [timeLeft, setTimeLeft] = useState(239); // 3:59 in seconds

  // --- CALCULATIONS ---
  const itemTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = itemTotal > 0 ? (itemTotal < 100 ? 20 : 30) : 0;
  const taxes = itemTotal * 0.05; 
  const grandTotal = itemTotal + deliveryFee + taxes;

  // --- TIMER LOGIC ---
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
    if (!address.trim()) return alert("📍 Please enter a delivery address!");
    if (!selectedMethod) return alert("💳 Select a payment method!");
    
    setPaymentStep("processing");
    
    // Simulate Bank Configuration for 3 seconds
    setTimeout(() => {
      setPaymentStep("scanning");
    }, 3000);
  };

  const finalizeOrder = async () => {
    try {
      const token = await getToken();
      const orderData = {
        clerkUserId: user.id,
        items: cart.map(item => ({ foodItem: item._id, quantity: item.quantity, price: item.price })),
        totalAmount: grandTotal,
        deliveryAddress: address
      };

      const response = await fetch("http://localhost:5000/api/orders/place", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        setPaymentStep("success");
        setTimeout(() => {
          clearCart();
          navigate("/");
        }, 5000);
      }
    } catch (error) {
      alert("System Overheated! Try again.");
      setPaymentStep("idle");
    }
  };

  if (cart.length === 0 && paymentStep === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <img src="https://cdn-icons-png.flaticon.com/512/11329/11329073.png" className="w-40 mb-6 opacity-20" alt="Empty" />
        <h2 className="text-xl font-bold text-slate-400">Cart is empty</h2>
        <Link to="/" className="mt-4 text-blue-600 font-bold hover:underline">Go get some food →</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 pb-32 font-sans">
      <h1 className="text-3xl font-black tracking-tighter mb-8">Secure Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT: Details */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Address Section */}
          <section>
            <h2 className="text-sm font-black uppercase text-slate-400 mb-4 tracking-widest">1. Delivery Location</h2>
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <textarea 
                className="w-full p-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-black outline-none text-sm"
                placeholder="Enter your full address in Muzaffarpur..."
                rows="3"
                value={address} onChange={e => setAddress(e.target.value)}
              />
            </div>
          </section>

          {/* Payment Methods */}
          <section>
            <h2 className="text-sm font-black uppercase text-slate-400 mb-4 tracking-widest">2. Payment Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: 'upi', icon: <Smartphone />, label: 'UPI / QR', desc: 'GPay, PhonePe' },
                { id: 'card', icon: <CreditCard />, label: 'Cards', desc: 'Visa, Master' },
                { id: 'net', icon: <Landmark />, label: 'Net Banking', desc: 'All Banks' }
              ].map(m => (
                <button 
                  key={m.id}
                  onClick={() => setSelectedMethod(m.id)}
                  className={`p-6 rounded-[2rem] border-2 transition-all text-left flex flex-col gap-4
                  ${selectedMethod === m.id ? 'border-black bg-black text-white' : 'border-slate-100 bg-white hover:border-slate-300'}`}
                >
                  <div className={selectedMethod === m.id ? 'text-white' : 'text-slate-400'}>{m.icon}</div>
                  <div>
                    <p className="font-bold text-sm">{m.label}</p>
                    <p className={`text-[10px] ${selectedMethod === m.id ? 'text-slate-400' : 'text-slate-500'}`}>{m.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* RIGHT: Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl sticky top-24">
            <h3 className="font-black text-lg mb-6">Order Summary</h3>
            <div className="space-y-4 text-sm font-medium border-b pb-6">
              <div className="flex justify-between text-slate-500"><span>Subtotal</span><span className="text-black">₹{itemTotal}</span></div>
              <div className="flex justify-between text-slate-500"><span>Delivery Fee</span><span className="text-black">₹{deliveryFee}</span></div>
              <div className="flex justify-between text-slate-500"><span>GST (5%)</span><span className="text-black">₹{taxes.toFixed(2)}</span></div>
            </div>
            <div className="flex justify-between text-xl font-black py-6">
              <span>Total</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleStartPayment}
              className="w-full bg-black text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
            >
              <ShieldCheck size={20} /> PAY NOW
            </button>
          </div>
        </div>
      </div>

      {/* --- STEP 1: PROCESSING LOADING --- */}
      {paymentStep === "processing" && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-md z-[200] flex flex-col items-center justify-center">
          <Loader2 className="animate-spin text-black mb-4" size={48} />
          <h2 className="text-xl font-black uppercase tracking-widest">Configuring Secure Gateway</h2>
          <p className="text-slate-500 text-sm mt-2">Checking bank servers for Cloudverse Muzaffarpur...</p>
        </div>
      )}

      {/* --- STEP 2: SCANNER (TIMER ACTIVE) --- */}
      {paymentStep === "scanning" && (
        <div className="fixed inset-0 bg-slate-900 z-[210] flex flex-col items-center justify-center p-6 text-white overflow-hidden">
          <div className="relative group cursor-pointer" onClick={finalizeOrder}>
            {/* The Scanner UI */}
            <div className="w-72 h-72 border-2 border-white/20 rounded-[3rem] p-6 relative bg-white flex items-center justify-center">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CLOUDVERSE_PAISA" alt="QR" className="w-full" />
              {/* Laser Line Animation */}
              <div className="absolute top-0 left-0 w-full h-1 bg-green-500 shadow-[0_0_15px_#22c55e] animate-scan-line"></div>
            </div>
            <div className="absolute -inset-4 bg-green-500/10 rounded-[4rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>

          <div className="mt-12 text-center">
            <div className="flex items-center justify-center gap-2 text-orange-500 font-mono text-2xl font-black mb-2">
              <Timer size={24} /> {formatTime(timeLeft)}
            </div>
            <p className="text-slate-400 text-sm font-bold tracking-widest uppercase">Waiting for scan...</p>
            <p className="text-slate-500 text-xs mt-8 max-w-xs opacity-50">Please do not refresh. This QR is valid for your current session in Muzaffarpur only.</p>
            
            <button 
              onClick={finalizeOrder}
              className="mt-12 bg-white text-black px-10 py-4 rounded-2xl font-black text-sm hover:scale-105 transition-all"
            >
              I HAVE SCANNED ✅
            </button>
          </div>
        </div>
      )}

      {/* --- STEP 3: SUCCESS (FUNNY GIF) --- */}
      {paymentStep === "success" && (
        <div className="fixed inset-0 bg-white z-[300] flex flex-col items-center justify-center p-8 text-center">
          {/* Funny GIF Placeholder (Swap with a real Tenor/Giphy link) */}
          <div className="w-full max-w-sm mb-8 rounded-[3rem] overflow-hidden shadow-2xl">
            <img 
              src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZmVpaHdpbmFhdHYxZ2VpbDZpN2djZTJ3cjl5ZGs5MHFzb2kwYzRveSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Rfwlp9c5bA7R3s7Y5D/giphy.gif" 
              className="w-full h-full object-cover" 
              alt="Funny Success" 
            />
          </div>
          <h1 className="text-5xl font-black text-black italic leading-tight">PAISA VASOOL!</h1>
          <p className="text-lg font-bold text-slate-500 mt-4 underline decoration-orange-500 underline-offset-8">Order #CV-{Math.floor(Math.random()*9000)+1000} is confirmed!</p>
          <div className="mt-12 flex items-center gap-3 bg-green-50 text-green-700 px-6 py-3 rounded-full font-bold text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
            Rider is speeding towards the restaurant!
          </div>
        </div>
      )}
    </div>
  );
}
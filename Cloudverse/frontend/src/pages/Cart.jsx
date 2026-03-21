import { useState, useContext, useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const { getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();
  const { cart, clearCart, increaseQuantity, decreaseQuantity } = useContext(CartContext);
  
  const [address, setAddress] = useState("");
  const [paymentStep, setPaymentStep] = useState("idle"); // idle, scanning, success, processing

  // --- DYNAMIC CALCULATIONS ---
  const itemTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  // LOGIC: Below 100 -> 20, Above 100 -> 30
  const deliveryFee = itemTotal > 0 ? (itemTotal < 100 ? 20 : 30) : 0;
  
  const taxes = itemTotal * 0.05; 
  const grandTotal = itemTotal + deliveryFee + taxes;

  const handleStartPayment = () => {
    if (!address.trim()) {
      alert("📍 Please enter a delivery address first!");
      return;
    }
    setPaymentStep("scanning");
  };

  const executeOrder = async () => {
    setPaymentStep("processing");
    try {
      const token = await getToken();
      const orderData = {
        clerkUserId: user.id,
        items: cart.map(item => ({
          foodItem: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
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
        }, 4000);
      } else {
        alert("❌ Order Failed. Please try again.");
        setPaymentStep("idle");
      }
    } catch (error) {
      console.error(error);
      setPaymentStep("idle");
    }
  };

  if (cart.length === 0 && paymentStep === "idle") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-7359557-6024626.png" className="w-48 h-48 mb-6" alt="Empty" />
        <h2 className="text-2xl font-black text-gray-800">Your cart is empty!</h2>
        <p className="text-gray-500 mt-2 mb-8">Add some yummy food from Muzaffarpur's best kitchens.</p>
        <Link to="/" className="bg-red-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-red-200">Order Now</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 pb-32">
      <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">Review Order</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* LEFT: Items & Address */}
        <div className="flex-1 space-y-6">
          {/* Address Card */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-3 flex items-center gap-2">📍 Delivery Address</h2>
            <textarea 
              className="w-full p-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-red-500 outline-none text-sm font-medium"
              placeholder="e.g. House No. 24, Near Gobarsahi Chowk, Muzaffarpur"
              value={address} onChange={e => setAddress(e.target.value)}
            />
          </div>

          {/* Items Card */}
          <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="font-bold text-gray-800 mb-4">Items in Cart</h2>
            <div className="space-y-6">
              {cart.map(item => (
                <div key={item._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${item.isVegetarian ? 'bg-green-600' : 'bg-red-600'}`}></div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm md:text-base">{item.name}</h4>
                      <p className="text-xs text-gray-500">₹{item.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-red-50 px-3 py-1 rounded-xl border border-red-100">
                      <button onClick={() => decreaseQuantity(item._id)} className="text-red-600 font-bold">−</button>
                      <span className="font-bold text-sm">{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item._id)} className="text-red-600 font-bold">+</button>
                    </div>
                    <span className="font-bold text-gray-900 text-sm w-12 text-right">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Billing (Sticky on desktop, Bottom bar on mobile) */}
        <div className="w-full lg:w-96">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Bill Details</h3>
            <div className="space-y-3 text-sm font-medium text-gray-500">
              <div className="flex justify-between"><span>Item Total</span><span className="text-gray-900">₹{itemTotal}</span></div>
              <div className="flex justify-between"><span>Delivery Fee</span><span className="text-red-500">+ ₹{deliveryFee}</span></div>
              <div className="flex justify-between border-b border-dashed pb-3"><span>Taxes (5%)</span><span className="text-gray-900">₹{taxes.toFixed(2)}</span></div>
              <div className="flex justify-between text-lg font-black text-gray-900 pt-1">
                <span>To Pay</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={handleStartPayment}
              className="w-full bg-red-600 text-white py-4 rounded-2xl font-bold mt-6 hover:bg-red-700 active:scale-95 transition-all"
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>

      {/* --- FUNNY PAYMENT OVERLAYS --- */}

      {/* 1. SCANNING STATE */}
      {paymentStep === "scanning" && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex flex-col items-center justify-center p-6 text-center">
           <div className="w-64 h-64 border-4 border-dashed border-green-500 rounded-3xl animate-pulse mb-8 flex items-center justify-center relative">
             <div className="absolute inset-0 bg-green-500/20 animate-ping rounded-3xl"></div>
             <span className="text-6xl">📸</span>
           </div>
           <h2 className="text-2xl font-bold text-white tracking-widest">SCANNING QR...</h2>
           <p className="text-gray-400 mt-2">Connecting to Cloudverse Safe-Vault</p>
           <button 
             onClick={executeOrder}
             className="mt-10 bg-green-600 text-white px-8 py-3 rounded-xl font-bold"
           >
             Tap to Confirm Payment ✅
           </button>
        </div>
      )}


      {paymentStep === "success" && (
        <div className="fixed inset-0 bg-white z-[110] flex flex-col items-center justify-center p-6 text-center">
          <div className="text-[120px] md:text-[180px] animate-bounce">🤣</div>
          <h1 className="text-4xl md:text-6xl font-black text-green-600 italic">PAISA VASOOL!</h1>
          <p className="text-xl font-bold text-gray-800 mt-4">Order Placed Successfully!</p>
          <div className="mt-8 bg-red-50 p-4 rounded-2xl">
             <p className="text-red-600 font-bold uppercase tracking-tighter">Chef is already crying while cooking! 👨‍🍳🔥</p>
          </div>
        </div>
      )}
    </div>
  );
}
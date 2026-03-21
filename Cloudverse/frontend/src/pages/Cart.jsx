import { useState, useContext } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

export default function Cart() {
  const { getToken } = useAuth();
  const { user } = useUser(); 

  // We now import our new increase/decrease functions!
  const { cart, clearCart, increaseQuantity, decreaseQuantity } = useContext(CartContext);
  
  const [address, setAddress] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false); // Controls the popup!

  // --- CALCULATIONS ---
  const itemTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = itemTotal > 0 ? 40 : 0; 
  const taxes = itemTotal * 0.05; 
  const grandTotal = itemTotal + deliveryFee + taxes;

  // --- MODAL TRIGGER ---
  const handleProceedToPay = () => {
    if (!address.trim()) {
      alert("⚠️ Please enter a delivery address before paying.");
      return;
    }
    setShowPaymentModal(true); // Open the fake payment scanner
  };

  // --- ACTUAL BACKEND SUBMISSION ---
  const placeOrder = async () => {
    setShowPaymentModal(false); // Close modal
    setIsPlacingOrder(true);

    try {
      const token = await getToken();
      const orderData = {
        clerkUserId: user.id, 
        restaurant: cart[0]?.restaurant, 
        items: cart.map(item => ({
          foodItem: item._id,
          quantity: item.quantity
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
        alert("🎉 Payment Successful! Your food is being prepared.");
        clearCart(); 
        setAddress(""); 
      } else {
        const data = await response.json();
        alert("❌ Failed to place order: " + data.message);
      }
    } catch (error) {
      console.error("Order error", error);
      alert("Something went wrong!");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  // --- EMPTY CART UI ---
  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="w-64 h-64 mb-6 opacity-80">
          <img src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-7359557-6024626.png" alt="Empty Cart" className="w-full h-full object-contain" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md">You can go to the home page to view more restaurants and add delicious items to your cart.</p>
        <Link to="/" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md">
          See Restaurants Near You
        </Link>
      </div>
    );
  }

  // --- POPULATED CART UI ---
  return (
    <div className="max-w-6xl mx-auto w-full relative">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Secure Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Cart Items & Address */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="text-2xl">📍</span> Delivery Address</h2>
            <textarea 
              rows="3" required placeholder="Enter your full address (e.g., Flat 402, Tower B, Kankarbagh, Patna)" 
              className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all font-medium text-gray-700 resize-none"
              value={address} onChange={e => setAddress(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="divide-y divide-gray-100">
              {cart.map((item, index) => (
                <div key={`${item._id}-${index}`} className="py-4 flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${item.isVegetarian !== false ? 'border-green-600' : 'border-red-600'}`}>
                      <div className={`w-2 h-2 rounded-full ${item.isVegetarian !== false ? 'bg-green-600' : 'bg-red-600'}`}></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500 font-medium">₹{item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* QUANTITY CONTROLS (Now working!) */}
                    <div className="flex items-center gap-3 bg-red-50 px-3 py-1 rounded-lg border border-red-100">
                      <button onClick={() => decreaseQuantity(item._id)} className="text-red-600 font-bold text-lg hover:scale-125 transition-transform">−</button>
                      <span className="font-bold text-gray-800 w-4 text-center">{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item._id)} className="text-red-600 font-bold text-lg hover:scale-125 transition-transform">+</button>
                    </div>
                    <span className="font-bold text-gray-900 w-16 text-right">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Bill Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-28">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Bill Details</h2>
            <div className="space-y-3 text-sm text-gray-600 mb-4">
              <div className="flex justify-between"><span>Item Total</span><span className="font-medium text-gray-800">₹{itemTotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Delivery Fee</span><span className="font-medium text-gray-800">₹{deliveryFee.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Taxes & Charges (5%)</span><span className="font-medium text-gray-800">₹{taxes.toFixed(2)}</span></div>
            </div>
            <div className="border-t border-gray-200 pt-4 mb-6 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">To Pay</span>
              <span className="text-xl font-extrabold text-gray-900">₹{grandTotal.toFixed(2)}</span>
            </div>

            <button 
              onClick={handleProceedToPay} // OPENS MODAL NOW
              disabled={isPlacingOrder}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-all flex justify-center items-center gap-2 
                ${isPlacingOrder ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5'}`}
            >
              {isPlacingOrder ? "Processing..." : "Proceed to Pay"}
            </button>
          </div>
        </div>
      </div>

      {/* --- FAKE PAYMENT MODAL OVERLAY --- */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-8 text-center shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            <h3 className="text-2xl font-black text-gray-900 mb-1">Scan to Pay</h3>
            <p className="text-gray-500 font-bold mb-6">Amount: ₹{grandTotal.toFixed(2)}</p>

            {/* Blurry QR Code Container */}
            <div className="relative mx-auto w-48 h-48 mb-6 border-4 border-gray-100 rounded-xl overflow-hidden shadow-inner">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" 
                alt="Fake QR Code" 
                className="w-full h-full object-cover blur-sm opacity-60 pointer-events-none" 
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="bg-black/70 text-white px-4 py-2 rounded-lg font-bold text-sm tracking-widest uppercase shadow-lg">
                  TEST MODE
                </span>
              </div>
            </div>

            {/* Strict Warning Box */}
            <div className="bg-red-50 border-2 border-red-200 p-4 rounded-xl mb-8">
              <div className="flex items-center justify-center gap-2 text-red-600 font-black uppercase tracking-wide mb-1">
                <span className="text-lg">⚠️</span> Fake Payment Gateway
              </div>
              <p className="text-xs text-red-500 font-bold leading-relaxed">
                This is a demo project. Do NOT scan or use a real UPI app. Click "Simulate Payment" below to test the order flow.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={() => setShowPaymentModal(false)} 
                className="flex-1 bg-gray-100 text-gray-700 py-3.5 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={placeOrder} // Submits order to DB
                className="flex-[2] bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-700 hover:shadow-lg transition-all"
              >
                Simulate Payment ✅
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
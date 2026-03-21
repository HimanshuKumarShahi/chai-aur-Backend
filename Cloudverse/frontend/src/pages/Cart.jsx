import { useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

export default function Cart() {
  const { getToken } = useAuth();
  const { user } = useUser(); // Needed to link the order to the customer in MongoDB

  // --- STATE ---
  // Using some dummy data so you can see the beautiful design! 
  // (Replace this with [] when you connect your global state/Redux/Context later)
  const [cart, setCart] = useState([
    { _id: "1", name: "Margherita Pizza", price: 299, quantity: 1, type: "veg", restaurant: "rest_123" },
    { _id: "2", name: "Peri Peri Fries", price: 149, quantity: 2, type: "veg", restaurant: "rest_123" }
  ]);
  
  const [address, setAddress] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // --- CALCULATIONS ---
  const itemTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = itemTotal > 0 ? 40 : 0; // Flat ₹40 delivery
  const taxes = itemTotal * 0.05; // 5% GST
  const grandTotal = itemTotal + deliveryFee + taxes;

  const placeOrder = async () => {
    if (!address.trim()) {
      alert("⚠️ Please enter a delivery address.");
      return;
    }

    setIsPlacingOrder(true);

    try {
      const token = await getToken();

      const orderData = {
        clerkUserId: user.id, // Fixed: Now linking to the actual user
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
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        alert("🎉 Order Placed Successfully! Your food is being prepared.");
        setCart([]); // Clear cart
        setAddress(""); // Clear address
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
          <img 
            src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-7359557-6024626.png" 
            alt="Empty Cart" 
            className="w-full h-full object-contain"
          />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-md">
          You can go to the home page to view more restaurants and add delicious items to your cart.
        </p>
        <Link to="/" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
          See Restaurants Near You
        </Link>
      </div>
    );
  }

  // --- POPULATED CART UI ---
  return (
    <div className="max-w-6xl mx-auto w-full">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Secure Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Cart Items & Address */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Delivery Address Box */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">📍</span> Delivery Address
            </h2>
            <textarea 
              rows="3"
              required
              placeholder="Enter your full address (e.g., Flat 402, Tower B, Kankarbagh, Patna)" 
              className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all font-medium text-gray-700 resize-none"
              value={address}
              onChange={e => setAddress(e.target.value)}
            />
          </div>

          {/* Cart Items List */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="divide-y divide-gray-100">
              {cart.map(item => (
                <div key={item._id} className="py-4 flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    {/* Veg/Non-veg icon indicator */}
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${item.type === 'veg' ? 'border-green-600' : 'border-red-600'}`}>
                      <div className={`w-2 h-2 rounded-full ${item.type === 'veg' ? 'bg-green-600' : 'bg-red-600'}`}></div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500 font-medium">₹{item.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Quantity Controls (Visual only for now) */}
                    <div className="flex items-center gap-3 bg-red-50 px-3 py-1 rounded-lg border border-red-100">
                      <button className="text-red-600 font-bold text-lg hover:scale-110 transition-transform">−</button>
                      <span className="font-bold text-gray-800 w-4 text-center">{item.quantity}</span>
                      <button className="text-red-600 font-bold text-lg hover:scale-110 transition-transform">+</button>
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
              <div className="flex justify-between">
                <span>Item Total</span>
                <span className="font-medium text-gray-800">₹{itemTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-medium text-gray-800">₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Charges (5%)</span>
                <span className="font-medium text-gray-800">₹{taxes.toFixed(2)}</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4 mb-6 flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">To Pay</span>
              <span className="text-xl font-extrabold text-gray-900">₹{grandTotal.toFixed(2)}</span>
            </div>

            <button 
              onClick={placeOrder} 
              disabled={isPlacingOrder}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-all flex justify-center items-center gap-2 
                ${isPlacingOrder 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5'}`}
            >
              {isPlacingOrder ? "Processing..." : "Proceed to Pay"}
            </button>
            <p className="text-xs text-center text-gray-400 mt-4 font-medium">
              By placing your order, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
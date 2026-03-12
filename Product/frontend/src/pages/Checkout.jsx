import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  const handlePayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate network request/payment gateway delay
    setTimeout(() => {
      setIsProcessing(false);
      alert("Payment Successful! Your order has been placed.");
      clearCart(); // Empty the cart
      navigate("/"); // Send user back to home page
    }, 2000);
  };

  if (cart.length === 0) {
    navigate("/");
    return null;
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-sm shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Secure Checkout</h2>
      <div className="bg-gray-100 p-4 rounded mb-6 text-center">
        <p className="text-gray-600">Total Amount to Pay</p>
        <p className="text-3xl font-bold text-gray-900">₹{total}</p>
      </div>

      <form onSubmit={handlePayment} className="flex flex-col gap-4">
        <input required placeholder="Full Name" className="border p-2 rounded focus:outline-blue-500" />
        <input required placeholder="Shipping Address" className="border p-2 rounded focus:outline-blue-500" />
        
        <div className="border p-4 rounded bg-gray-50 flex flex-col gap-3 mt-2">
          <p className="font-semibold text-sm text-gray-700 mb-1">Fake Card Details</p>
          <input required placeholder="Card Number (16 digits)" maxLength="16" className="border p-2 rounded focus:outline-blue-500" />
          <div className="flex gap-2">
            <input required placeholder="MM/YY" maxLength="5" className="border p-2 rounded focus:outline-blue-500 w-1/2" />
            <input required placeholder="CVV" maxLength="3" type="password" className="border p-2 rounded focus:outline-blue-500 w-1/2" />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isProcessing}
          className={`mt-4 py-3 rounded-sm font-bold shadow text-white ${isProcessing ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {isProcessing ? "Processing Payment..." : `Pay ₹${total} Now`}
        </button>
      </form>
    </div>
  );
}
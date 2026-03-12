import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart } = useCart();

  const total = cart.reduce((sum, item) => sum + Number(item.price), 0);

  if (cart.length === 0) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
        <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-sm hover:bg-blue-700">
          Go Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-sm shadow-sm mt-6">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2">Shopping Cart</h2>
      
      <div className="flex flex-col gap-4 mb-6">
        {cart.map((item, index) => (
          <div key={index} className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-4">
              <img src={item.image} alt={item.title} className="w-16 h-16 object-contain" />
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.category}</p>
              </div>
            </div>
            <p className="font-bold text-lg">₹{item.price}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border-t pt-4">
        <h3 className="text-xl font-bold">Total: ₹{total}</h3>
        <Link 
          to="/checkout" 
          className="bg-[#fb641b] hover:bg-[#e85d19] text-white px-8 py-3 rounded-sm font-bold shadow"
        >
          Place Order
        </Link>
      </div>
    </div>
  );
}
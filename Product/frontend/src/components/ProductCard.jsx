import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-white p-4 rounded-sm shadow-sm hover:shadow-lg transition flex flex-col group border border-gray-200">
      <div className="h-48 flex justify-center items-center overflow-hidden mb-4">
        <img 
          src={product.image} 
          alt={product.title} 
          className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300" 
        />
      </div>
      <div className="flex-1 flex flex-col">
        <h3 className="text-gray-800 font-medium truncate mb-1">{product.title}</h3>
        <span className="text-gray-500 text-sm mb-2">{product.category}</span>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
        </div>
        <button 
          onClick={() => addToCart(product)}
          className="mt-auto w-full bg-[#ff9f00] hover:bg-[#f39800] text-white py-2 rounded-sm font-semibold transition shadow"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
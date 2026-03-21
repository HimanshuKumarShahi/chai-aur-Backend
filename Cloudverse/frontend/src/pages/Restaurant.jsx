import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import BackButton from "../components/BackButton"; // <-- 1. Import your new Back Button!

export default function Restaurant() {
  const { id } = useParams();
  
  // We now need state for BOTH the restaurant details and the food items
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Grab the addToCart function from our global context
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    // Fetch both the Restaurant info AND the Food info
    const fetchRestaurantData = async () => {
      try {
        // 1. Fetch all restaurants and find the one that matches this ID
        // (Using this method so it works even if you haven't built a specific single-restaurant backend route yet!)
        const restRes = await fetch("http://localhost:5000/api/restaurants");
        const restData = await restRes.json();
        const currentRestaurant = restData.find(r => r._id === id);
        setRestaurant(currentRestaurant);

        // 2. Fetch the food items specifically for this restaurant
        const foodRes = await fetch(`http://localhost:5000/api/food/restaurant/${id}`);
        const foodData = await foodRes.json();
        setFoods(foodData);

      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurantData();
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto w-full pb-20 mt-4">
      
      {/* --- THE NEW BACK BUTTON --- */}
      <BackButton />

      {isLoading ? (
        <div className="text-center py-20 text-gray-500 font-bold animate-pulse">
          Loading delicious food...
        </div>
      ) : (
        <>
          {/* --- DYNAMIC RESTAURANT HERO SECTION --- */}
          <div className="relative bg-black rounded-3xl mb-8 shadow-md overflow-hidden h-64 border border-gray-100 mt-2">
            {/* Background Image */}
            <img 
              src={restaurant?.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000"} 
              alt={restaurant?.name}
              className="w-full h-full object-cover opacity-60"
            />
            
            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

            {/* Restaurant Info over the image */}
            <div className="absolute bottom-0 left-0 p-8 w-full">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
                {restaurant?.name || "Restaurant Menu"}
              </h1>
              <p className="text-gray-200 font-medium flex items-center gap-2 mb-3">
                📍 {restaurant?.address || "Location not available"}
              </p>
              
              <div className="flex gap-3">
                <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase border border-white/30">
                  ⭐ 4.3 (1k+ ratings)
                </span>
                <span className="bg-green-500/90 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-sm">
                  Open Now
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recommended Items</h2>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          {/* --- FOOD ITEMS LIST --- */}
          {foods.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <span className="text-5xl block mb-4 opacity-50">🍽️</span>
              <h3 className="text-xl font-bold text-gray-800">No items available</h3>
              <p className="text-gray-500 mt-2">This restaurant hasn't added any food to their menu yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {foods.map(item => (
                <div key={item._id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex justify-between gap-6 group hover:shadow-md transition-shadow">
                  
                  {/* LEFT SIDE: Food Details */}
                  <div className="flex-1 flex flex-col justify-center">
                    
                    <div className={`w-4 h-4 rounded border flex items-center justify-center mb-2 ${item.isVegetarian !== false ? 'border-green-600' : 'border-red-600'}`}>
                      <div className={`w-2 h-2 rounded-full ${item.isVegetarian !== false ? 'bg-green-600' : 'bg-red-600'}`}></div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                    <p className="font-bold text-gray-800 mt-1">₹{item.price}</p>
                    
                    <div className="flex items-center gap-1 mt-2 text-yellow-500 text-sm font-bold">
                      <span>★</span><span>★</span><span>★</span><span>★</span><span className="text-gray-300">★</span>
                      <span className="text-gray-400 text-xs ml-1">(42)</span>
                    </div>

                    <p className="text-gray-500 text-sm mt-3 line-clamp-2 leading-relaxed max-w-md">
                      {item.description}
                    </p>
                  </div>

                  {/* RIGHT SIDE: Image & Add Button */}
                  <div className="relative w-36 h-36 shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover rounded-2xl shadow-sm"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800"; // Fallback food image
                      }}
                    />
                    
                    {/* The Context Add To Cart Button! */}
                    <button 
                      onClick={() => addToCart(item)}
                      className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white text-green-600 border border-gray-200 px-6 py-2 rounded-xl font-extrabold text-sm shadow-md hover:bg-gray-50 hover:shadow-lg transition-all active:scale-95"
                    >
                      ADD
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
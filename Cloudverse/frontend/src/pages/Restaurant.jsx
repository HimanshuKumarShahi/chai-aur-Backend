import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import BackButton from "../components/BackButton";

export default function Restaurant() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [addedItemName, setAddedItemName] = useState("");

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const restRes = await fetch("http://localhost:5000/api/restaurants");
        const restData = await restRes.json();
        const currentRestaurant = restData.find(r => r._id === id);
        setRestaurant(currentRestaurant);

        const foodRes = await fetch(`http://localhost:5000/api/food/restaurant/${id}`);
        const foodData = await foodRes.json();
        setFoods(foodData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRestaurantData();
  }, [id]);

  const handleAdd = (item) => {
    addToCart(item);
    setAddedItemName(item.name);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000); // Hide after 2 seconds
  };

  return (
    <div className="max-w-4xl mx-auto w-full pb-20 mt-4 px-4">
      <BackButton />

      {/* SUCCESS TOAST POPUP */}
      {showToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce border-2 border-red-500">
          <span className="text-xl">✅</span>
          <span className="font-bold text-sm tracking-tight">{addedItemName} added to cart!</span>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-20 animate-pulse text-gray-400 font-bold">Preparing Menu...</div>
      ) : (
        <>
          {/* HERO SECTION */}
          <div className="relative h-64 rounded-3xl overflow-hidden mb-8 shadow-lg mt-4">
            <img src={restaurant?.image} className="w-full h-full object-cover" alt={restaurant?.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-8">
              <h1 className="text-4xl font-black text-white">{restaurant?.name}</h1>
              <p className="text-gray-300 font-bold mt-1">📍 {restaurant?.address}</p>
            </div>
          </div>

          <h2 className="text-2xl font-black mb-6 flex items-center gap-4">
            Menu <div className="h-1 bg-red-600 w-12 rounded-full"></div>
          </h2>

          <div className="flex flex-col gap-6">
            {foods.map(item => (
              <div key={item._id} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex justify-between gap-6 hover:shadow-md transition-all">
                <div className="flex-1">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center mb-2 ${item.isVegetarian ? 'border-green-600' : 'border-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${item.isVegetarian ? 'bg-green-600' : 'bg-red-600'}`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                  <p className="font-black text-gray-900 mt-1">₹{item.price}</p>
                  <p className="text-gray-400 text-sm mt-2 line-clamp-2">{item.description}</p>
                </div>

                <div className="relative w-32 h-32 md:w-40 md:h-40">
                  <img src={item.image} className="w-full h-full object-cover rounded-2xl border" alt={item.name} />
                  <button 
                    onClick={() => handleAdd(item)}
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white text-green-600 border border-gray-200 px-8 py-2 rounded-xl font-black text-sm shadow-md hover:bg-green-50 active:scale-90 transition-all"
                  >
                    ADD
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
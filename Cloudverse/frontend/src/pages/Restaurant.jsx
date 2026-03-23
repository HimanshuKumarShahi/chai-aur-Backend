import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";
import BackButton from "../components/BackButton";
import { Star } from "lucide-react";

export default function Restaurant() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [tab, setTab] = useState("all");
  const [sort, setSort] = useState("default");
  const [loading, setLoading] = useState(true);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/restaurants");
        const data = await res.json();
        const current = data.find((r) => r._id === id);
        setRestaurant(current);

        const fRes = await fetch(
          `http://localhost:5000/api/food/restaurant/${id}`
        );
        const foodData = await fRes.json();
        setFoods(foodData);
        setFiltered(foodData);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // FILTER LOGIC
  useEffect(() => {
    let result = [...foods];

    if (tab === "food") result = result.filter((i) => !i.isDrink);
    if (tab === "drinks") result = result.filter((i) => i.isDrink);

    if (sort === "low") result.sort((a, b) => a.price - b.price);

    setFiltered(result);
  }, [tab, sort, foods]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-orange-500 font-bold">
        Loading menu...
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">

     {/* HERO HEADER */}
<div className="relative w-full h-56 md:h-72">

  {/* BACKGROUND IMAGE */}
  <img
    src={restaurant?.image}
    alt={restaurant?.name}
    className="w-full h-full object-cover"
  />

  {/* DARK OVERLAY */}
  <div className="absolute inset-0 bg-black/60" />

  {/* CONTENT */}
  <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-6 text-white">

    {/* BACK BUTTON */}
    <div className="absolute top-4 left-4 z-50">
      <BackButton />
    </div>

    {/* TEXT */}
    <h1 className="text-2xl md:text-4xl font-bold leading-tight">
      {restaurant?.name}
    </h1>

    <div className="flex items-center gap-2 text-sm text-gray-200 mt-1">
      <Star size={14} fill="orange" />
      {restaurant?.rating || "4.2"}
      <span className="text-gray-300">• 20-30 min</span>
    </div>
  </div>
</div>

      {/* FILTER BAR */}
      <div className="sticky top-[72px] z-30 bg-white border-b px-4 py-3 flex gap-3 overflow-x-auto">

        {["all", "food", "drinks"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
              tab === t
                ? "bg-orange-500 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {t}
          </button>
        ))}

        <button
          onClick={() => setSort(sort === "low" ? "default" : "low")}
          className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap ${
            sort === "low"
              ? "bg-orange-500 text-white"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          Price ↑
        </button>
      </div>

      {/* FOOD LIST */}
      <div className="px-4 mt-4 space-y-6">

        {filtered.length === 0 ? (
          <p className="text-gray-500">No items found</p>
        ) : (
          filtered.map((item) => (
            <div
              key={item._id}
              className="bg-white p-4 rounded-xl shadow-sm flex justify-between gap-4 hover:shadow-md transition"
            >
              {/* LEFT */}
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{item.name}</h2>

                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {item.description}
                </p>

                <p className="font-bold mt-2">₹{item.price}</p>

                <button
                  onClick={() => addToCart(item)}
                  className="mt-3 px-4 py-1.5 bg-orange-500 text-white text-sm rounded-md hover:bg-orange-600"
                >
                  ADD
                </button>
              </div>

              {/* RIGHT IMAGE */}
              <div className="w-28 h-28 rounded-lg overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
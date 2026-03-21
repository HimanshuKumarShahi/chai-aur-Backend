import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import BackButton from "../components/BackButton";

export default function AddFood() {
  const { getToken } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "", // THIS IS REQUIRED BY YOUR BACKEND
    restaurant: "",
    isVegetarian: "true",
    image: "",
  });

  // 1. Fetch Restaurants
  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/restaurants");
        const data = await res.json();
        setRestaurants(data);
        if (data.length > 0) {
          setForm((prev) => ({ ...prev, restaurant: data[0]._id }));
        }
      } catch (err) {
        console.error("Error fetching restaurants:", err);
      }
    };
    loadRestaurants();
  }, []);

  // 2. Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final check before sending
    if (!form.category.trim()) return alert("Please enter a category (e.g., Pizza, Biryani)");
    if (!form.restaurant) return alert("Please select a restaurant!");
    
    setIsSubmitting(true);
    try {
      const token = await getToken();
      const response = await fetch("http://localhost:5000/api/food/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (response.ok) {
        alert("✅ Food Item Added Successfully!");
        // Reset form but keep the selected restaurant
        setForm({ ...form, name: "", description: "", price: "", category: "", image: "" });
      } else {
        const errData = await response.json();
        alert("❌ Error: " + errData.message);
      }
    } catch (error) {
      alert("Network Error - Check if server is running");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputStyle = "w-full p-4 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-red-500 focus:bg-white transition-all";

  return (
    <div className="max-w-2xl mx-auto p-6 pb-20">
      <BackButton />
      <h1 className="text-3xl font-black mb-8 text-gray-900">Add New Dish</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border shadow-sm flex flex-col gap-5">
        
        {/* RESTAURANT SELECTOR */}
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-600">Choose Restaurant</label>
          <select 
            required
            className={inputStyle}
            value={form.restaurant}
            onChange={(e) => setForm({ ...form, restaurant: e.target.value })}
          >
            {restaurants.length === 0 ? (
              <option>Loading restaurants...</option>
            ) : (
              restaurants.map((r) => (
                <option key={r._id} value={r._id}>{r.name}</option>
              ))
            )}
          </select>
        </div>

        {/* DISH NAME & CATEGORY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
             <label className="block text-sm font-bold mb-2 text-gray-600">Dish Name</label>
             <input required placeholder="e.g. Chicken Dum Biryani" className={inputStyle} value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
          </div>
          <div>
             <label className="block text-sm font-bold mb-2 text-gray-600">Category</label>
             <input required placeholder="e.g. Biryani, Pizza, Chai" className={inputStyle} value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
          </div>
        </div>

        {/* IMAGE URL */}
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-600">Image URL</label>
          <input required placeholder="Paste Unsplash or Image Link" className={inputStyle} value={form.image} onChange={e => setForm({...form, image: e.target.value})} />
        </div>
        
        {form.image && (
          <div className="relative group">
            <img src={form.image} className="w-full h-48 object-cover rounded-2xl border" alt="Preview" />
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Preview</div>
          </div>
        )}

        {/* DESCRIPTION */}
        <div>
          <label className="block text-sm font-bold mb-2 text-gray-600">Description</label>
          <textarea required rows="2" placeholder="Tell users what makes this dish special..." className={inputStyle} value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
        </div>

        {/* PRICE & TYPE */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-600">Price (₹)</label>
            <input required type="number" placeholder="299" className={inputStyle} value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2 text-gray-600">Type</label>
            <select className={inputStyle} value={form.isVegetarian} onChange={e => setForm({...form, isVegetarian: e.target.value})}>
              <option value="true">🟢 Veg</option>
              <option value="false">🔴 Non-Veg</option>
            </select>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button 
          type="submit"
          disabled={isSubmitting}
          className="bg-red-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-red-700 transition-all shadow-lg active:scale-95 disabled:bg-gray-400 mt-4"
        >
          {isSubmitting ? "Uploading to Cloudverse..." : "Confirm & Save Dish"}
        </button>
      </form>
    </div>
  );
}
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

export default function AddFood() {
  const { getToken } = useAuth();

  // Changed restaurantId to restaurant to match your backend model exactly
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    restaurant: "", 
    isVegetarian: true,
  });

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // For the live preview
  const [restaurants, setRestaurants] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch restaurants for the dropdown
  useEffect(() => {
    fetch("http://localhost:5000/api/restaurants")
      .then(res => res.json())
      .then(data => setRestaurants(data))
      .catch(err => console.error("Failed to load restaurants", err));
  }, []);

  // Handle Image Selection + Preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file)); // Generate a temporary preview URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page reload
    setIsSubmitting(true);

    try {
      const token = await getToken();

      const formData = new FormData();
      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });
      formData.append("image", image);

      const response = await fetch("http://localhost:5000/api/food/add", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        alert("✅ Food Item Added Successfully!");
        // Reset form
        setForm({ name: "", description: "", price: "", category: "", restaurant: "", isVegetarian: true });
        setImage(null);
        setImagePreview(null);
      } else {
        const errorData = await response.json();
        alert("❌ Error: " + errorData.message);
      }
    } catch (error) {
      console.error("Upload failed", error);
      alert("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reusable input styling class
  const inputClass = "w-full p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all font-medium text-gray-700";
  const labelClass = "block text-sm font-bold text-gray-700 mb-2";

  return (
    <div className="max-w-3xl mx-auto w-full">
      
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Add New Menu Item</h1>
        <p className="text-gray-500 mt-2 font-medium">Create a new dish to display on your restaurant's menu.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-6">
        
        {/* ROW 1: Restaurant & Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Select Restaurant</label>
            <select 
              required
              className={inputClass}
              value={form.restaurant}
              onChange={e => setForm({...form, restaurant: e.target.value})}
            >
              <option value="" disabled>-- Choose a Restaurant --</option>
              {restaurants.map(r => (
                <option key={r._id} value={r._id}>{r.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={labelClass}>Dish Name</label>
            <input 
              required
              type="text"
              placeholder="e.g. Garlic Bread" 
              className={inputClass}
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})} 
            />
          </div>
        </div>

        {/* ROW 2: Description */}
        <div>
          <label className={labelClass}>Description</label>
          <textarea 
            required
            rows="3"
            placeholder="Describe the ingredients, taste, and preparation..." 
            className={`${inputClass} resize-none`}
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})} 
          />
        </div>

        {/* ROW 3: Price, Category, Diet */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Price (₹)</label>
            <input 
              required
              type="number"
              min="0"
              placeholder="e.g. 299" 
              className={inputClass}
              value={form.price}
              onChange={e => setForm({...form, price: e.target.value})} 
            />
          </div>

          <div>
            <label className={labelClass}>Category</label>
            <input 
              required
              type="text"
              placeholder="e.g. Starters, Pizza" 
              className={inputClass}
              value={form.category}
              onChange={e => setForm({...form, category: e.target.value})} 
            />
          </div>

          <div>
            <label className={labelClass}>Dietary Preference</label>
            <select 
              className={inputClass}
              value={form.isVegetarian}
              onChange={e => setForm({...form, isVegetarian: e.target.value === "true"})}
            >
              <option value="true">🟢 Vegetarian</option>
              <option value="false">🔴 Non-Vegetarian</option>
            </select>
          </div>
        </div>

        {/* ROW 4: Image Upload with Preview */}
        <div>
          <label className={labelClass}>Food Image</label>
          <div className="flex items-center gap-6">
            
            {/* The Image Preview Box */}
            <div className="w-24 h-24 shrink-0 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl text-gray-300">📸</span>
              )}
            </div>

            {/* Custom Styled File Input */}
            <div className="flex-1">
              <input 
                required
                type="file" 
                accept="image/*"
                id="file-upload"
                className="hidden" // Hide the ugly default input
                onChange={handleImageChange} 
              />
              <label 
                htmlFor="file-upload" 
                className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-red-50 text-red-700 font-bold rounded-xl border border-red-200 hover:bg-red-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {image ? "Change Image" : "Upload High-Res Image"}
              </label>
              <p className="text-xs text-gray-500 mt-2 font-medium">JPEG, PNG or WebP accepted. Max file size 5MB.</p>
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <div className="pt-4 border-t border-gray-100 mt-2">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-all flex justify-center items-center gap-2 
              ${isSubmitting 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-black text-white hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5'}`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading to Cloudverse...
              </>
            ) : (
              "Add Item to Menu"
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
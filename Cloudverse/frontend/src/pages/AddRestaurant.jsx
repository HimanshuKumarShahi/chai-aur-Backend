import { useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";

export default function AddRestaurant() {
  const { getToken } = useAuth();
  const { user } = useUser(); // We need the user's ID for the ownerId field!

  const [form, setForm] = useState({
    name: "",
    address: "",
    image: "",
    cuisine: ""
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    
    if (!user) {
      alert("Error: User profile not loaded yet.");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = await getToken();

      const response = await fetch("http://localhost:5000/api/restaurants/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: form.name,
          address: form.address,
          image: form.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800", // Fallback if empty
          cuisine: form.cuisine.split(",").map(c => c.trim()), // Clean up spaces after commas
          ownerId: user.id // Send the Clerk ID as the owner
        })
      });

      if (response.ok) {
        alert("✅ Restaurant Added Successfully!");
        setForm({ name: "", address: "", image: "", cuisine: "" }); // Clear form
      } else {
        const errorData = await response.json();
        alert("❌ Error: " + errorData.message);
      }
    } catch (error) {
      console.error("Failed to create restaurant", error);
      alert("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reusable Tailwind classes for consistency
  const inputClass = "w-full p-3 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all font-medium text-gray-700";
  const labelClass = "block text-sm font-bold text-gray-700 mb-2";

  return (
    <div className="max-w-4xl mx-auto w-full">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Register a Restaurant</h1>
        <p className="text-gray-500 mt-2 font-medium">Add a new restaurant storefront to the Cloudverse platform.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: The Form (Takes up 2/3 of the space) */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Restaurant Name</label>
              <input 
                required
                type="text"
                placeholder="e.g. Cloudverse Cafe" 
                className={inputClass}
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})} 
              />
            </div>

            <div>
              <label className={labelClass}>Cuisine Types</label>
              <input 
                required
                type="text"
                placeholder="e.g. Italian, Fast Food, Chinese" 
                className={inputClass}
                value={form.cuisine}
                onChange={e => setForm({...form, cuisine: e.target.value})} 
              />
              <p className="text-xs text-gray-400 mt-1">Separate multiple cuisines with a comma.</p>
            </div>
          </div>

          <div>
            <label className={labelClass}>Full Address</label>
            <input 
              required
              type="text"
              placeholder="e.g. 123 Food Street, Patna, Bihar" 
              className={inputClass}
              value={form.address}
              onChange={e => setForm({...form, address: e.target.value})} 
            />
          </div>

          <div>
            <label className={labelClass}>Cover Image URL</label>
            <input 
              type="url"
              placeholder="https://example.com/image.jpg" 
              className={inputClass}
              value={form.image}
              onChange={e => setForm({...form, image: e.target.value})} 
            />
          </div>

          <div className="pt-4 border-t border-gray-100 mt-2">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-md transition-all flex justify-center items-center gap-2 
                ${isSubmitting 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:-translate-y-0.5'}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Registering...
                </>
              ) : (
                "Create Restaurant"
              )}
            </button>
          </div>
        </form>

        {/* Right Side: Live Image Preview (Takes up 1/3 of the space) */}
        <div className="lg:col-span-1">
          <label className={labelClass}>Image Preview</label>
          <div className="w-full h-64 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 overflow-hidden flex flex-col justify-center items-center relative shadow-inner">
            {form.image ? (
              <img 
                src={form.image} 
                alt="Restaurant Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800"; // Fallback if URL is broken
                }}
              />
            ) : (
              <div className="text-center p-6">
                <span className="text-5xl block mb-3 opacity-50">🏪</span>
                <p className="text-sm font-medium text-gray-500">Paste an image URL to see a preview</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
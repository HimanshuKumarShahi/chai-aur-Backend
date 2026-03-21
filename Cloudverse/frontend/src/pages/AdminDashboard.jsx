import { useState, useEffect } from 'react';
import { useAuth, useUser } from "@clerk/clerk-react";

export default function AdminDashboard() {
  const { getToken } = useAuth();
  const { user } = useUser(); // Grab the logged-in admin's details
  
  // --- STATE: RESTAURANTS ---
  const [restaurants, setRestaurants] = useState([]);
  const [restName, setRestName] = useState('');
  const [restAddress, setRestAddress] = useState('');
  const [restImage, setRestImage] = useState('');

  // --- STATE: FOOD ITEMS ---
  const [foodName, setFoodName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [foodImage, setFoodImage] = useState(null); 
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');

  // 1. Fetch all restaurants when the page loads
  const fetchRestaurants = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/restaurants');
      const data = await response.json();
      setRestaurants(data);
      if (data.length > 0) setSelectedRestaurantId(data[0]._id); // Default to first restaurant
    } catch (error) {
      console.error("Failed to fetch restaurants", error);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  // 2. Function to Create a New Restaurant
  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      const response = await fetch('http://localhost:5000/api/restaurants/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' // Sending standard JSON text here
        },
        body: JSON.stringify({
          name: restName,
          address: restAddress,
          image: restImage || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800", // Fallback image
          ownerId: user.id // The Clerk ID of the person making it
        })
      });

      if (response.ok) {
        alert("✅ Restaurant Created!");
        fetchRestaurants(); // Refresh the dropdown list
        setRestName(''); setRestAddress(''); setRestImage('');
      } else {
        const data = await response.json();
        alert("❌ Error: " + data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // 3. Function to Add Food to the Selected Restaurant
  const handleAddFood = async (e) => {
    e.preventDefault();
    try {
      const token = await getToken();
      
      // We MUST use FormData because we are uploading a physical File
      const formData = new FormData();
      formData.append('name', foodName);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('restaurant', selectedRestaurantId); 
      formData.append('image', foodImage); // The File object

      const response = await fetch('http://localhost:5000/api/food/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // DO NOT set Content-Type here. The browser does it automatically for FormData.
        },
        body: formData
      });

      if (response.ok) {
        alert("✅ Food Item Added to Menu!");
        // Clear food form
        setFoodName(''); setDescription(''); setPrice(''); setCategory(''); setFoodImage(null);
      } else {
        const data = await response.json();
        alert("❌ Error: " + data.message);
      }
    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      
      {/* LEFT COLUMN: Create Restaurant */}
      <div className="bg-white shadow-xl rounded-xl p-8 border-t-4 border-red-600">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">1. Create a Restaurant</h2>
        <form onSubmit={handleCreateRestaurant} className="flex flex-col gap-4">
          <input type="text" placeholder="Restaurant Name (e.g. Cloudverse Cafe)" required
            className="border p-3 rounded bg-gray-50" value={restName} onChange={(e) => setRestName(e.target.value)} />
          <input type="text" placeholder="Full Address" required
            className="border p-3 rounded bg-gray-50" value={restAddress} onChange={(e) => setRestAddress(e.target.value)} />
          <input type="text" placeholder="Image URL (Optional)" 
            className="border p-3 rounded bg-gray-50" value={restImage} onChange={(e) => setRestImage(e.target.value)} />
          <button type="submit" className="bg-red-600 text-white p-3 rounded-lg font-bold hover:bg-red-700 transition">
            Create Restaurant
          </button>
        </form>
      </div>

      {/* RIGHT COLUMN: Add Food Item */}
      <div className="bg-white shadow-xl rounded-xl p-8 border-t-4 border-black">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">2. Add Menu Items</h2>
        
        {restaurants.length === 0 ? (
          <p className="text-red-500 font-bold bg-red-50 p-4 rounded">⚠️ Please create a restaurant first!</p>
        ) : (
          <form onSubmit={handleAddFood} className="flex flex-col gap-4">
            
            {/* Dropdown to select which restaurant gets this food */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Select Restaurant</label>
              <select 
                className="w-full border p-3 rounded bg-gray-50 font-semibold"
                value={selectedRestaurantId} 
                onChange={(e) => setSelectedRestaurantId(e.target.value)}
              >
                {restaurants.map(r => (
                  <option key={r._id} value={r._id}>{r.name}</option>
                ))}
              </select>
            </div>

            <input type="text" placeholder="Food Name (e.g. Margherita Pizza)" required
              className="border p-3 rounded" value={foodName} onChange={(e) => setFoodName(e.target.value)} />
            <textarea placeholder="Description" required
              className="border p-3 rounded" value={description} onChange={(e) => setDescription(e.target.value)} />
            
            <div className="flex gap-4">
              <input type="number" placeholder="Price (₹)" required
                className="border p-3 rounded w-1/2" value={price} onChange={(e) => setPrice(e.target.value)} />
              <input type="text" placeholder="Category (e.g. Pizza)" required
                className="border p-3 rounded w-1/2" value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            
            <div className="border p-3 rounded bg-gray-50">
              <label className="block text-sm font-bold text-gray-700 mb-2">Upload Food Image (Required)</label>
              <input type="file" accept="image/*" required
                onChange={(e) => setFoodImage(e.target.files[0])} />
            </div>

            <button type="submit" className="bg-black text-white p-3 rounded-lg font-bold hover:bg-gray-800 transition">
              Upload to Cloudinary & Add to Menu
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
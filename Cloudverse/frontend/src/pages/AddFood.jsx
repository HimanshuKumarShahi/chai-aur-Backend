import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

export default function AddFood() {
  const { getToken } = useAuth();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    restaurantId: "",
    isVegetarian: true,
  });

  const [image, setImage] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  // fetch restaurants
  useEffect(() => {
    fetch("http://localhost:5000/api/restaurants")
      .then(res => res.json())
      .then(data => setRestaurants(data));
  }, []);

  const handleSubmit = async () => {
    const token = await getToken();

    const formData = new FormData();
    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });
    formData.append("image", image);

    await fetch("http://localhost:5000/api/food/add", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    alert("Food Added");
  };

  return (
    <div className="p-4 flex flex-col gap-3 max-w-md">
      <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
      <input placeholder="Description" onChange={e => setForm({...form, description: e.target.value})} />
      <input placeholder="Price" onChange={e => setForm({...form, price: e.target.value})} />
      <input placeholder="Category" onChange={e => setForm({...form, category: e.target.value})} />

      {/* Restaurant dropdown */}
      <select onChange={e => setForm({...form, restaurantId: e.target.value})}>
        <option>Select Restaurant</option>
        {restaurants.map(r => (
          <option key={r._id} value={r._id}>{r.name}</option>
        ))}
      </select>

      {/* Veg toggle */}
      <select onChange={e => setForm({...form, isVegetarian: e.target.value === "true"})}>
        <option value="true">Vegetarian</option>
        <option value="false">Non-Veg</option>
      </select>

      {/* Image */}
      <input type="file" onChange={e => setImage(e.target.files[0])} />

      <button onClick={handleSubmit} className="bg-black text-white p-2">
        Add Food
      </button>
    </div>
  );
}
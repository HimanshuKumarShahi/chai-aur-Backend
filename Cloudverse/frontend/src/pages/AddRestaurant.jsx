import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

export default function AddRestaurant() {
  const { getToken } = useAuth();

  const [form, setForm] = useState({
    name: "",
    address: "",
    image: "",
    cuisine: ""
  });

  const handleSubmit = async () => {
    const token = await getToken();

    await fetch("http://localhost:5000/api/restaurants/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        ...form,
        cuisine: form.cuisine.split(",")
      })
    });

    alert("Restaurant Added");
  };

  return (
    <div className="p-4">
      <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
      <input placeholder="Address" onChange={e => setForm({...form, address: e.target.value})} />
      <input placeholder="Image URL" onChange={e => setForm({...form, image: e.target.value})} />
      <input placeholder="Cuisine" onChange={e => setForm({...form, cuisine: e.target.value})} />

      <button onClick={handleSubmit} className="bg-black text-white p-2 mt-2">
        Add
      </button>
    </div>
  );
}
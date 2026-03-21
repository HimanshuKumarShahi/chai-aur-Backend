import { useEffect, useState } from "react";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/restaurants")
      .then(res => res.json())
      .then(data => setRestaurants(data));
  }, []);

  return (
    <div className="p-4 grid grid-cols-3 gap-4">
      {restaurants.map(r => (
        <div key={r._id} className="border p-4 rounded">
          <img src={r.image} className="h-40 w-full object-cover" />
          <h2 className="text-lg font-bold">{r.name}</h2>
          <p>{r.address}</p>
        </div>
      ))}
    </div>
  );
}
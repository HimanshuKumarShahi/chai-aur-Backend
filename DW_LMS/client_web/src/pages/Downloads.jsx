import { useEffect, useState } from "react";
import axios from "axios";

export default function Downloads() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/download/user123`)
      .then(res => setData(res.data));
  }, []);

  return (
    <div className="bg-black text-white p-6 min-h-screen">
      <h1 className="text-orange-500 text-2xl mb-4">Downloads</h1>

      {data.map(d => (
        <div key={d._id} className="bg-gray-900 p-4 mb-3 rounded">
          <p>{d.courseId}</p>
          <a href={d.fileUrl} className="text-orange-400">Open</a>
        </div>
      ))}
    </div>
  );
}
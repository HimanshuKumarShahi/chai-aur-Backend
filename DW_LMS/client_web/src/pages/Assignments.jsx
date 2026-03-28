import { useEffect, useState } from "react";
import axios from "axios";

export default function Assignments() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/assignment/COURSE_ID`)
      .then(res => setData(res.data));
  }, []);

  return (
    <div className="bg-black text-white p-6 min-h-screen">
      <h1 className="text-orange-500 text-2xl mb-4">Assignments</h1>

      {data.map(a => (
        <div key={a._id} className="bg-gray-900 p-4 mb-3 rounded">
          <p>{a.title}</p>
          <a href={a.fileUrl} className="text-orange-400">Download</a>
        </div>
      ))}
    </div>
  );
}
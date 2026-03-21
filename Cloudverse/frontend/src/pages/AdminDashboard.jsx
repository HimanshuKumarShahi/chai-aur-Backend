import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>

      <div className="flex gap-4 mt-4">
        <Link to="/admin/add-restaurant" className="bg-black text-white px-4 py-2">
          Add Restaurant
        </Link>

        <Link to="/admin/add-food" className="bg-black text-white px-4 py-2">
          Add Food
        </Link>
      </div>
    </div>
  );
}
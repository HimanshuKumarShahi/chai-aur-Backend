import { Outlet, Link } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar */}
      <div className="w-64 bg-black text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>

        <div className="flex flex-col gap-3">
          <Link to="/admin">Dashboard</Link>
          <Link to="/admin/add-restaurant">Add Restaurant</Link>
          <Link to="/admin/add-food">Add Food</Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 bg-gray-100">
        <Outlet />
      </div>
    </div>
  );
}
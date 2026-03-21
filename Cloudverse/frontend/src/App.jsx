import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useUserSync } from "./hooks/useUserSync";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import UserLayout from "./layouts/UserLayout";

// Pages
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Restaurant from "./pages/Restaurant";
import AdminDashboard from "./pages/AdminDashboard";
import AddRestaurant from "./pages/AddRestaurant";
import AddFood from "./pages/AddFood";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  useUserSync(); 

  return (
    <BrowserRouter>
      <Routes>

        {/* ================= USER ROUTES ================= */}
        {/* UserLayout usually contains your Navbar */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/restaurant/:id" element={<Restaurant />} />
        </Route>

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          {/* Use 'index' for the main /admin page */}
          <Route index element={<AdminDashboard />} /> 
          
          {/* These will be /admin/add-restaurant and /admin/add-food */}
          <Route path="add-restaurant" element={<AddRestaurant />} />
          <Route path="add-food" element={<AddFood />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}
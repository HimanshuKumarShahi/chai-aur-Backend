import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import UploadProduct from "./pages/UploadProduct";
import Cart from "./pages/Cart";             // Add this import
import Checkout from "./pages/Checkout";     // Add this import
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./context/CartContext";

export default function App() {
  return (
    <CartProvider>
      <Navbar />
      <main className="max-w-7xl mx-auto p-4 pt-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />          {/* Add Cart Route */}
          <Route path="/checkout" element={<Checkout />} />  {/* Add Checkout Route */}
          
          <Route 
            path="/upload" 
            element={
              <ProtectedRoute>
                <UploadProduct />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </CartProvider>
  );
}
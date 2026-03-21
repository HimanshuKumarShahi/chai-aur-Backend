import { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cloudverse_cart");
    return saved ? JSON.parse(saved) : [];
  });

  // 3MB Safety Check & LocalStorage Sync
  useEffect(() => {
    const dataString = JSON.stringify(cart);
    const size = new Blob([dataString]).size;
    const MAX_SIZE = 3 * 1024 * 1024; // 3MB

    if (size > MAX_SIZE) {
      alert("⚠️ Cart is too heavy (over 3MB)! To prevent system lag, this change wasn't saved.");
    } else {
      localStorage.setItem("cloudverse_cart", dataString);
    }
  }, [cart]);

  const addToCart = (item) => {
    setCart((prev) => {
      const exists = prev.find((i) => i._id === item._id);
      if (exists) {
        return prev.map((i) => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const increaseQuantity = (id) => setCart(prev => prev.map(i => i._id === id ? { ...i, quantity: i.quantity + 1 } : i));
  const decreaseQuantity = (id) => setCart(prev => prev.map(i => i._id === id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0));
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, increaseQuantity, decreaseQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}
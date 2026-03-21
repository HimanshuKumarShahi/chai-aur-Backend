import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";

export default function Cart() {
  const { getToken } = useAuth();

  const [cart, setCart] = useState([]);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const placeOrder = async () => {
    const token = await getToken();

    const orderData = {
      restaurant: cart[0]?.restaurant,
      items: cart.map(item => ({
        foodItem: item._id,
        quantity: item.quantity
      })),
      totalAmount: total,
      deliveryAddress: "Default Address"
    };

    await fetch("http://localhost:5000/api/orders/place", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    alert("Order Placed");
    setCart([]);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Cart</h1>

      {cart.length === 0 && <p>No items</p>}

      {cart.map(item => (
        <div key={item._id} className="flex justify-between border p-2 mb-2">
          <span>{item.name}</span>
          <span>{item.quantity} x ₹{item.price}</span>
        </div>
      ))}

      <h2 className="mt-4">Total: ₹{total}</h2>

      {cart.length > 0 && (
        <button onClick={placeOrder} className="bg-black text-white p-2 mt-2">
          Place Order
        </button>
      )}
    </div>
  );
}
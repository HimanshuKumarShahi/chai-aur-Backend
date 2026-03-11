import { useEffect, useState } from "react";
import { getProducts } from "../api/productApi";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <div>
      <h1>Products</h1>

      {products.map((p) => (
        <div key={p._id}>
          <img src={p.image} width="200" />
          <h3>{p.title}</h3>
          <p>{p.price}</p>
        </div>
      ))}
    </div>
  );
}
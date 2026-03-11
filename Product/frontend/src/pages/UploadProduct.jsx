import { useState } from "react";
import { createProduct } from "../api/productApi";

export default function UploadProduct() {
  const [form, setForm] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("image", form.image);

    await createProduct(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="title"
        onChange={(e)=>setForm({...form,title:e.target.value})} />

      <input placeholder="price"
        onChange={(e)=>setForm({...form,price:e.target.value})} />

      <input type="file"
        onChange={(e)=>setForm({...form,image:e.target.files[0]})} />

      <button type="submit">Upload</button>
    </form>
  );
}
import { useState } from "react";
import { createProduct } from "../api/productApi";
import { useNavigate } from "react-router-dom";

export default function UploadProduct() {
  const [form, setForm] = useState({ title: '', price: '', description: '', category: '' });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image");

    setLoading(true);
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("image", image);

    try {
      await createProduct(formData);
      alert("Product uploaded successfully!");
      navigate("/");
    } catch (error) {
      alert("Failed to upload product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-8 rounded-sm shadow-md mt-10">
      <h2 className="text-2xl font-bold mb-6 text-blue-600 border-b pb-2">Upload New Product</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input 
          required placeholder="Product Title" className="border p-2 rounded focus:outline-blue-500"
          onChange={(e) => setForm({ ...form, title: e.target.value })} 
        />
        <input 
          required type="number" placeholder="Price (₹)" className="border p-2 rounded focus:outline-blue-500"
          onChange={(e) => setForm({ ...form, price: e.target.value })} 
        />
        <input 
          required placeholder="Category (e.g. Mobiles)" className="border p-2 rounded focus:outline-blue-500"
          onChange={(e) => setForm({ ...form, category: e.target.value })} 
        />
        <textarea 
          required placeholder="Description" rows="3" className="border p-2 rounded focus:outline-blue-500"
          onChange={(e) => setForm({ ...form, description: e.target.value })} 
        />
        <input 
          required type="file" accept="image/*" className="border p-2 rounded"
          onChange={(e) => setImage(e.target.files[0])} 
        />
        <button 
          type="submit" disabled={loading}
          className="bg-[#fb641b] hover:bg-[#e85d19] text-white py-3 rounded-sm font-bold shadow mt-2 disabled:bg-gray-400"
        >
          {loading ? "Uploading..." : "Publish Product"}
        </button>
      </form>
    </div>
  );
}
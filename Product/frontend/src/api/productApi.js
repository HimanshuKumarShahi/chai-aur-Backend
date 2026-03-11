import axios from "axios";

const API = "http://localhost:5000/api/products";

export const getProducts = async () => {
  const res = await axios.get(API);
  return res.data;
};

export const createProduct = async (formData) => {
  const res = await axios.post(API, formData);
  return res.data;
};
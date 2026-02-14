import axios from "axios";

const api = axios.create({
<<<<<<< HEAD
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false,
=======
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
>>>>>>> 3775c8ac4dcc2da0ce0d2e59612f620805103cb9
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

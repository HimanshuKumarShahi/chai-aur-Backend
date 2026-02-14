import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);


    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    // UPDATED CONTAINER:
    // 1. min-h-[80vh]: Ensures it takes up vertical space so it can be centered vertically.
    // 2. w-full: Ensures it spans the whole width so it can be centered horizontally.
    // 3. flex items-center justify-center: The magic commands that center the box.
    <div className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center px-4 py-10">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[100px] pointer-events-none">
        <div className="h-64 w-64 rounded-full bg-indigo-600/40"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-[#12141C]/80 p-8 shadow-2xl backdrop-blur-xl">
        
        <div className="text-center">
          <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-xl font-bold text-white shadow-lg shadow-white/5">
            ₹
          </div>
          <h2 className="text-2xl font-bold text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-white/50">
            Please enter your details to sign in.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div className="space-y-1">
            <label className="text-sm font-medium text-white/70">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              type="email"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-white/20 outline-none transition-all focus:border-indigo-500/50 focus:bg-black/60 focus:ring-1 focus:ring-indigo-500/50"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-white/70">Password</label>
            <input
              name="password"
              value={form.password}
              onChange={onChange}
              type="password"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-white/20 outline-none transition-all focus:border-indigo-500/50 focus:bg-black/60 focus:ring-1 focus:ring-indigo-500/50"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            disabled={loading}
            className="group w-full rounded-xl bg-white py-3.5 text-sm font-bold text-black transition-all hover:bg-gray-200 hover:shadow-lg hover:shadow-white/10 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-4 text-sm sm:flex-row sm:justify-between">
          <Link to="/forgot" className="text-white/40 transition-colors hover:text-white">
            Forgot password?
          </Link>
          <p className="text-white/40">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-white transition-colors hover:text-indigo-400">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

// 1. Reusable Spinner Component
const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // Added error state

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null); // Clear error on type
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.post("/auth/register", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      // 2. Capture error message for UI display
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // 3. Layout: Uses the same "flex-1 w-full items-center" trick to center content
    <div className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center px-4 py-10">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[100px] pointer-events-none">
        <div className="h-72 w-72 rounded-full bg-purple-600/40"></div>
      </div>

      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-[#12141C]/80 p-8 shadow-2xl backdrop-blur-xl">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-xl font-bold text-white shadow-lg shadow-white/5">
            ₹
          </div>
          <h2 className="text-2xl font-bold text-white">Create Account</h2>
          <p className="mt-2 text-sm text-white/50">
            Join NeoBank to manage your wealth.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="mt-8 space-y-5">
          
          {/* Name Input */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-white/70">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              type="text"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-white/20 outline-none transition-all focus:border-indigo-500/50 focus:bg-black/60 focus:ring-1 focus:ring-indigo-500/50"
              placeholder="e.g. Aditi Sharma"
              required
            />
          </div>

          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-white/70">Email Address</label>
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              type="email"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-white/20 outline-none transition-all focus:border-indigo-500/50 focus:bg-black/60 focus:ring-1 focus:ring-indigo-500/50"
              placeholder="name@company.com"
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-white/70">Password</label>
            <input
              name="password"
              value={form.password}
              onChange={onChange}
              type="password"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-white/20 outline-none transition-all focus:border-indigo-500/50 focus:bg-black/60 focus:ring-1 focus:ring-indigo-500/50"
              placeholder="Min 6 characters"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            disabled={loading}
            className="group mt-2 flex w-full items-center justify-center rounded-xl bg-white py-3.5 text-sm font-bold text-black transition-all hover:bg-gray-200 hover:shadow-lg hover:shadow-white/10 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? <Spinner /> : null}
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        {/* Footer Links */}
        <div className="mt-8 flex flex-col items-center gap-4 text-sm text-white/40">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-white transition-colors hover:text-indigo-400">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
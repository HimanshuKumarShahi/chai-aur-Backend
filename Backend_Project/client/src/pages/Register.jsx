import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/register", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-7 shadow-xl">
        <h2 className="text-2xl font-semibold text-white">Register</h2>
        <p className="mt-1 text-sm text-white/50">
          Create your secure banking account.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-white/70">Full Name</label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              type="text"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/20"
              placeholder="Himanshu"
              required
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Email</label>
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              type="email"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/20"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="text-sm text-white/70">Password</label>
            <input
              name="password"
              value={form.password}
              onChange={onChange}
              type="password"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/20"
              placeholder="Min 5 characters"
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between text-sm">
          <Link to="/login" className="text-white/60 hover:text-white">
            Already have account?
          </Link>

          <Link to="/" className="text-white/60 hover:text-white">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}

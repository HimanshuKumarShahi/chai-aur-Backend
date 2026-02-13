import { useEffect, useState } from "react";
import api from "../api/api";

export default function Profile() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const fetchMe = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load profile");
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="max-w-xl rounded-3xl border border-white/10 bg-white/5 p-7 shadow-xl">
        <h1 className="text-2xl font-semibold text-white">Profile</h1>
        <p className="mt-1 text-sm text-white/50">
          Your account information.
        </p>

        {!user ? (
          <p className="mt-6 text-white/60">Loading...</p>
        ) : (
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-white/50">Name</p>
              <p className="mt-1 text-white">{user.name}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-white/50">Email</p>
              <p className="mt-1 text-white">{user.email}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-sm text-white/50">User ID</p>
              <p className="mt-1 break-all text-white">{user._id}</p>
            </div>

            <button
              onClick={fetchMe}
              className="w-full rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/15"
            >
              Refresh Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

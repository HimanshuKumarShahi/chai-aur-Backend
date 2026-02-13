import { Link } from "react-router-dom";
import { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const submit = (e) => {
    e.preventDefault();
    alert("Backend forgot-password not implemented. This is UI only.");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-7 shadow-xl">
        <h2 className="text-2xl font-semibold text-white">Forgot Password</h2>
        <p className="mt-1 text-sm text-white/50">
          Enter your email to reset password.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-white/70">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/20"
              placeholder="you@example.com"
              required
            />
          </div>

          <button className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-white/90">
            Send Reset Link
          </button>
        </form>

        <div className="mt-5 text-sm">
          <Link to="/login" className="text-white/60 hover:text-white">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}

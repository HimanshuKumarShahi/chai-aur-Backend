import { Link } from "react-router-dom";
import { useState } from "react";

// Reusable Spinner
const Spinner = () => (
  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    // 1. Container: Centered Layout matching Login/Register
    <div className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center px-4 py-10">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[100px] pointer-events-none">
        <div className="h-64 w-64 rounded-full bg-blue-600/40"></div>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-[#12141C]/80 p-8 shadow-2xl backdrop-blur-xl">
        
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-xl font-bold text-white shadow-lg shadow-white/5">
            ?
          </div>
          <h2 className="text-2xl font-bold text-white">Forgot Password?</h2>
          <p className="mt-2 text-sm text-white/50">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        {/* Success Message State */}
        {submitted ? (
          <div className="mt-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-8 w-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Check your email</h3>
            <p className="mt-2 text-sm text-white/50">
              We sent a password reset link to <span className="text-white">{email}</span>
            </p>
            <button 
              onClick={() => setSubmitted(false)}
              className="mt-6 text-sm text-indigo-400 hover:text-indigo-300"
            >
              Try another email
            </button>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={submit} className="mt-8 space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-white/70">Email Address</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-white/20 outline-none transition-all focus:border-indigo-500/50 focus:bg-black/60 focus:ring-1 focus:ring-indigo-500/50"
                placeholder="Enter your email"
                required
              />
            </div>

            <button 
              disabled={loading}
              className="group flex w-full items-center justify-center rounded-xl bg-white py-3.5 text-sm font-bold text-black transition-all hover:bg-gray-200 hover:shadow-lg hover:shadow-white/10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? <Spinner /> : null}
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {/* Footer */}
        <div className="mt-8 flex justify-center text-sm">
          <Link 
            to="/login" 
            className="flex items-center gap-2 text-white/40 transition-colors hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
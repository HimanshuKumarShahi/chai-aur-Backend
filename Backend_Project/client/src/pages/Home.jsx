import { Link } from "react-router-dom";

export default function Home() {
  const token = localStorage.getItem("token");

  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <p className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            Secure • Fast • Simple
          </p>

          <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-5xl">
            A clean banking dashboard for your MERN project.
          </h1>

          <p className="mt-4 text-white/60">
            Create accounts, deposit, withdraw, transfer money, and view your
            transaction history — all protected with JWT.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            {token ? (
              <Link
                to="/dashboard"
                className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-white/90"
                >
                  Create Account
                </Link>
                <Link
                  to="/login"
                  className="rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          <p className="mt-4 text-xs text-white/40">
            Tip: Start by registering, then create your first bank account in
            dashboard.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
          <p className="text-sm font-semibold text-white">Features</p>
          <ul className="mt-4 space-y-3 text-sm text-white/60">
            <li>✅ JWT Auth + Protected Pages</li>
            <li>✅ Multiple accounts per user</li>
            <li>✅ Deposit / Withdraw / Transfer</li>
            <li>✅ Transaction history</li>
            <li>✅ Clean Tailwind UI</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

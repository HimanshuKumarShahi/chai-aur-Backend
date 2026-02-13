import { Link, NavLink, useNavigate } from "react-router-dom";

const navLinkClass = ({ isActive }) =>
  `rounded-xl px-3 py-2 text-sm transition ${
    isActive
      ? "bg-white/10 text-white"
      : "text-white/70 hover:bg-white/5 hover:text-white"
  }`;

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0F1A]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-2xl bg-white/10 text-white">
            ₹
          </div>
          <div>
            <p className="text-sm font-semibold text-white">NeoBank</p>
            <p className="text-[11px] text-white/50">Banking Dashboard</p>
          </div>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          {token ? (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/deposit" className={navLinkClass}>
                Deposit
              </NavLink>
              <NavLink to="/withdraw" className={navLinkClass}>
                Withdraw
              </NavLink>
              <NavLink to="/transfer" className={navLinkClass}>
                Transfer
              </NavLink>
              <NavLink to="/transactions" className={navLinkClass}>
                Transactions
              </NavLink>
              <NavLink to="/profile" className={navLinkClass}>
                Profile
              </NavLink>

              <button
                onClick={logout}
                className="rounded-xl bg-red-500/20 px-3 py-2 text-sm text-red-200 hover:bg-red-500/30"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={navLinkClass}>
                Register
              </NavLink>
            </>
          )}
        </div>

        <div className="md:hidden">
          <button
            onClick={() => navigate(token ? "/dashboard" : "/login")}
            className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white"
          >
            {token ? "Dashboard" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

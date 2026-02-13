import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";

// 1. Icon Components for cleaner JSX
const MenuIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const CloseIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const navLinkClass = ({ isActive }) =>
  `rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200 ${
    isActive
      ? "bg-white/10 text-white shadow-sm shadow-white/5"
      : "text-white/70 hover:bg-white/5 hover:text-white"
  }`;

// Mobile links need to be block-level to be easily clickable
const mobileNavLinkClass = ({ isActive }) =>
  `block w-full rounded-xl px-4 py-3 text-base font-medium transition-all duration-200 ${
    isActive
      ? "bg-white/10 text-white border border-white/5"
      : "text-white/70 hover:bg-white/5 hover:text-white hover:pl-5"
  }`;

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");

  // 2. Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#0B0F1A]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/10 text-white transition-transform group-hover:scale-105">
            <span className="text-lg font-bold">₹</span>
          </div>
          <div>
            <p className="text-sm font-bold text-white tracking-wide">NeoBank</p>
            <p className="text-[10px] text-white/50 uppercase tracking-wider font-medium">Dashboard</p>
          </div>
        </Link>

        {/* Desktop Navigation (Hidden on Mobile) */}
        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>

          {token ? (
            <>
              <div className="mx-2 h-4 w-px bg-white/10"></div> {/* Divider */}
              <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>
              <NavLink to="/deposit" className={navLinkClass}>Deposit</NavLink>
              <NavLink to="/withdraw" className={navLinkClass}>Withdraw</NavLink>
              <NavLink to="/transfer" className={navLinkClass}>Transfer</NavLink>
              <NavLink to="/transactions" className={navLinkClass}>History</NavLink>
              <div className="mx-2 h-4 w-px bg-white/10"></div> {/* Divider */}
              
              <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
              <button
                onClick={logout}
                className="ml-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20 hover:text-red-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <div className="mx-2 h-4 w-px bg-white/10"></div>
              <NavLink to="/login" className={navLinkClass}>Login</NavLink>
              <NavLink to="/register" className="ml-2 rounded-xl bg-white text-black px-4 py-2 text-sm font-bold hover:bg-gray-200 transition">
                Get Started
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button (Visible only on Mobile) */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden rounded-xl bg-white/5 p-2 text-white hover:bg-white/10 border border-white/5"
          aria-label="Toggle menu"
        >
          {isOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {/* We use conditional rendering based on isOpen state */}
      <div 
        className={`md:hidden absolute w-full border-b border-white/10 bg-[#0B0F1A] px-4 py-4 shadow-2xl transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5 pointer-events-none hidden"
        }`}
      >
        <div className="flex flex-col space-y-2">
          <NavLink to="/" className={mobileNavLinkClass}>Home</NavLink>
          
          {token ? (
            <>
              <NavLink to="/dashboard" className={mobileNavLinkClass}>Dashboard</NavLink>
              <NavLink to="/deposit" className={mobileNavLinkClass}>Deposit</NavLink>
              <NavLink to="/withdraw" className={mobileNavLinkClass}>Withdraw</NavLink>
              <NavLink to="/transfer" className={mobileNavLinkClass}>Transfer</NavLink>
              <NavLink to="/transactions" className={mobileNavLinkClass}>Transactions</NavLink>
              <NavLink to="/profile" className={mobileNavLinkClass}>Profile</NavLink>
              
              <div className="my-2 border-t border-white/10 pt-2">
                <button
                  onClick={logout}
                  className="w-full rounded-xl bg-red-500/20 px-4 py-3 text-left text-sm font-medium text-red-200 hover:bg-red-500/30"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
               <div className="my-2 border-t border-white/10 pt-2 grid grid-cols-2 gap-3">
                <NavLink to="/login" className="flex items-center justify-center rounded-xl bg-white/5 py-3 text-white border border-white/10">
                  Login
                </NavLink>
                <NavLink to="/register" className="flex items-center justify-center rounded-xl bg-white py-3 text-black font-bold">
                  Register
                </NavLink>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
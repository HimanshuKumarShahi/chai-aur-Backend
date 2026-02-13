import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import StatCard from "../components/StatCard";

// --- 1. ICONS (Defined locally to prevent import errors) ---
const WalletIcon = ({ className }) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
  </svg>
);
const BankIcon = ({ className }) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
  </svg>
);
const PlusIcon = ({ className }) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);
const TrashIcon = ({ className }) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

// --- 2. SUB-COMPONENTS ---

const QuickActionButton = ({ onClick, label, icon: Icon, primary }) => (
  <button
    onClick={onClick}
    className={`group flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all hover:-translate-y-0.5 hover:shadow-lg ${
      primary
        ? "bg-white text-black hover:bg-gray-200"
        : "border border-white/10 bg-white/5 text-white hover:bg-white/10"
    }`}
  >
    <div className={`flex h-6 w-6 items-center justify-center rounded-full ${primary ? "bg-black/10" : "bg-white/10"}`}>
      {Icon && <Icon className="h-3 w-3" />}
    </div>
    {label}
  </button>
);

// Account Card with Crash Protection (Safe Access)
const AccountCard = ({ id, type, balance, number, onDelete }) => {
  // Safe formatting to prevent crashes if data is missing
  const safeBalance = (balance || 0).toLocaleString();
  const safeNumber = number ? String(number).slice(-4) : "0000";

  return (
    <div className="group relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20">
      
      {/* Background Gradient */}
      <div className={`absolute inset-0 z-0 ${
        type === "Savings" 
          ? "bg-gradient-to-br from-indigo-600 to-blue-800" 
          : "bg-gradient-to-br from-[#232526] to-[#414345]"
      }`}></div>
      
      {/* Texture Overlay */}
      <div className="absolute inset-0 z-0 bg-white/5 opacity-20"></div>

      <div className="relative z-10 flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/20 backdrop-blur-md">
             <span className="text-lg font-bold text-white">₹</span>
          </div>
          <div>
            <p className="text-xs font-medium text-white/70 uppercase tracking-wider">NeoBank</p>
            <p className="text-sm font-bold text-white">{type}</p>
          </div>
        </div>
        
        {/* DELETE BUTTON */}
        <button 
          onClick={() => onDelete(id)}
          className="rounded-full bg-black/20 p-2 text-white/50 backdrop-blur-md transition-colors hover:bg-red-500/80 hover:text-white"
          title="Block & Delete Card"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="relative z-10 mt-8">
        <p className="text-xs text-white/60">Available Balance</p>
        <h3 className="text-3xl font-bold text-white tracking-tight">₹ {safeBalance}</h3>
      </div>

      <div className="relative z-10 mt-8 flex items-center justify-between">
        <p className="font-mono text-sm text-white/80 tracking-widest">
          •••• •••• {safeNumber}
        </p>
        <div className="h-6 w-10 rounded bg-white/20 backdrop-blur-md"></div>
      </div>
    </div>
  );
};

// --- 3. MAIN DASHBOARD COMPONENT ---
export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: "User" });

  // Load User & Accounts
  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user") || '{"name": "User"}');
      setUser(storedUser);
      fetchAccounts();
    } catch (e) {
      console.error("Initialization error:", e);
      setLoading(false);
    }
  }, []);

  const fetchAccounts = async () => {
    try {
      // Ensure api path is correct in your project
      const res = await api.get("/accounts/my");
      setAccounts(res.data.accounts || []);
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, a) => sum + Number(a.balance || 0), 0);
  }, [accounts]);

  const createAccount = async (type) => {
    try {
      await api.post("/accounts/create", { accountType: type });
      fetchAccounts();
    } catch (err) {
      alert("Failed to create account. Please try again.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to block and delete this card?")) {
      try {
        setAccounts((prev) => prev.filter((acc) => acc._id !== id));
        await api.delete(`/accounts/${id}`);
      } catch (err) {
        alert("Failed to delete account");
        fetchAccounts();
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0F1A] pb-20 pt-10 text-white">
      {/* Background Effect */}
      <div className="fixed top-0 left-0 h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        
        {/* HEADER */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-2 text-white/50">
              Welcome back, <span className="text-white font-medium">{user?.name || "User"}</span>
            </p>
          </div>
          
          <div className="flex gap-3">
            <QuickActionButton 
              label="Add Savings" 
              icon={PlusIcon} 
              onClick={() => createAccount("Savings")} 
              primary={true} 
            />
            <QuickActionButton 
              label="Add Current" 
              icon={PlusIcon} 
              onClick={() => createAccount("Current")} 
            />
          </div>
        </div>

        {/* STATS */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard 
            title="Total Liquidity" 
            value={`₹ ${(totalBalance || 0).toLocaleString()}`} 
            sub="Across all accounts"
            icon={WalletIcon}
            isPositive={true}
            trend="+12%"
          />
          <StatCard 
            title="Active Cards" 
            value={accounts.length} 
            sub="Virtual cards generated"
            icon={BankIcon}
          />
          <StatCard 
            title="Monthly Limit" 
            value="₹ 5.0L" 
            sub="Remaining limit"
          />
        </div>

        {/* ACCOUNTS GRID */}
        <div className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-white">My Cards</h2>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>

          {loading ? (
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1,2].map(i => <div key={i} className="h-56 w-full animate-pulse rounded-3xl bg-white/5"></div>)}
             </div>
          ) : accounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 py-24 text-center">
              <div className="mb-4 rounded-full bg-white/10 p-4">
                <WalletIcon className="h-8 w-8 text-white/50" />
              </div>
              <p className="text-lg text-white/60">No active cards found.</p>
              <button onClick={() => createAccount("Savings")} className="mt-4 text-sm font-bold text-indigo-400 hover:text-indigo-300">Create your first card</button>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {accounts.map((acc) => (
                <AccountCard 
                  key={acc._id}
                  id={acc._id}
                  type={acc.accountType}
                  balance={acc.balance}
                  number={acc.accountNumber}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
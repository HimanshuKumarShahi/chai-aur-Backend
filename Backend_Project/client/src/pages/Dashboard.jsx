import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import StatCard from "../components/StatCard";


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
const CopyIcon = ({ className }) => (
  <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" />
  </svg>
);



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

const AccountCard = ({ id, type, balance, number, onDelete }) => {
  const safeBalance = (balance || 0).toLocaleString();
  
  const handleCopy = () => {
    navigator.clipboard.writeText(number);
    alert("Account number copied to clipboard!");
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/20">
      <div className={`absolute inset-0 z-0 ${
        type === "Savings" 
          ? "bg-gradient-to-br from-indigo-600 to-blue-800" 
          : "bg-gradient-to-br from-[#232526] to-[#414345]"
      }`}></div>
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
        
        <button 
          onClick={() => onDelete(id)}
          className="rounded-full bg-black/20 p-2 text-white/50 backdrop-blur-md transition-colors hover:bg-red-500/80 hover:text-white"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="relative z-10 mt-8">
        <p className="text-xs text-white/60">Available Balance</p>
        <h3 className="text-3xl font-bold text-white tracking-tight">₹ {safeBalance}</h3>
      </div>

      <div className="relative z-10 mt-8 flex items-center justify-between border-t border-white/10 pt-4">
        <div>
          <p className="text-[10px] uppercase text-white/40 mb-1">Account Number</p>
          <p className="font-mono text-sm text-white/80 tracking-widest">
            {number || "Generating..."}
          </p>
        </div>
        <button 
          onClick={handleCopy}
          className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all"
          title="Copy Number"
        >
          <CopyIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};


export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: "User" });

  useEffect(() => {
    const init = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user") || '{"name": "User"}');
      setUser(storedUser);
      await fetchAccounts();
    };
    init();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/accounts/my");
      setAccounts(res.data.accounts || []);
    } catch (err) {
      console.error("Fetch error:", err);
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
      alert("Failed to create account.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this card? This cannot be undone.")) {
      try {
        await api.delete(`/accounts/${id}`);
        setAccounts(prev => prev.filter(acc => acc._id !== id));
      } catch (err) {
        alert("Delete failed.");
        fetchAccounts();
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0F1A] pb-20 pt-10 text-white font-sans">
      <div className="fixed top-0 left-0 h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
            <p className="mt-2 text-white/50">
              Welcome back, <span className="text-indigo-400 font-semibold">{user?.name}</span>
            </p>
          </div>
          
          <div className="flex gap-3">
            <QuickActionButton label="Add Savings" icon={PlusIcon} onClick={() => createAccount("Savings")} primary />
            <QuickActionButton label="Add Current" icon={PlusIcon} onClick={() => createAccount("Current")} />
          </div>
        </header>

        <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard 
            title="Total Liquidity" 
            value={`₹ ${totalBalance.toLocaleString()}`} 
            sub="Combined Balance"
            icon={WalletIcon}
            isPositive={true}
            trend="+8.4%"
          />
          <StatCard 
            title="Active Cards" 
            value={accounts.length} 
            sub="Virtual cards"
            icon={BankIcon}
          />
          <StatCard 
            title="Transfer Limit" 
            value="₹ 5.0L" 
            sub="Monthly Cap"
          />
        </section>

        <main className="mt-16">
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold">My Virtual Cards</h2>
            <div className="h-px flex-1 bg-white/10"></div>
          </div>

          {loading ? (
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               {[1, 2, 3].map(i => (
                 <div key={i} className="h-64 w-full animate-pulse rounded-3xl bg-white/5 border border-white/5"></div>
               ))}
             </div>
          ) : accounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-white/10 bg-white/5 py-24 text-center">
              <div className="mb-4 rounded-full bg-indigo-500/10 p-6">
                <WalletIcon className="h-10 w-10 text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold">No active cards</h3>
              <p className="mt-2 text-white/40">Start by creating a virtual savings or current account.</p>
              <button 
                onClick={() => createAccount("Savings")} 
                className="mt-6 rounded-full bg-indigo-600 px-8 py-3 font-bold hover:bg-indigo-500 transition-all"
              >
                Create First Card
              </button>
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
        </main>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

// --- Icons ---
const WalletIcon = ({ className }) => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" /></svg>;
const CheckIcon = ({ className }) => <svg fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;

// --- Components ---

// 1. Visual Account Selector Card
const AccountOption = ({ account, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 ${
      isSelected
        ? "border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
        : "border-white/5 bg-white/5 hover:bg-white/10"
    }`}
  >
    <div className="flex items-center justify-between">
      <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? "text-emerald-400" : "text-white/50"}`}>
        {account.accountType}
      </span>
      {isSelected && <div className="rounded-full bg-emerald-500 p-0.5"><CheckIcon className="h-3 w-3 text-black" /></div>}
    </div>
    <div className="mt-3">
      <p className="text-lg font-bold text-white">₹{account.balance.toLocaleString()}</p>
      <p className="text-xs text-white/40">•••• {String(account.accountNumber).slice(-4)}</p>
    </div>
  </div>
);

export default function Deposit() {
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | success | error

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await api.get("/accounts/my");
      const list = res.data.accounts || [];
      setAccounts(list);
      if (list.length > 0 && !accountId) setAccountId(list[0]._id);
    } catch (err) {
      console.error("Failed to load accounts");
    }
  };

  const handleQuickAdd = (val) => {
    // If empty, just set. If number exists, add to it.
    const current = amount ? Number(amount) : 0;
    setAmount((current + val).toString());
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!accountId || !amount) return;

    setLoading(true);
    setStatus("idle");

    try {
      await api.post("/transactions/deposit", {
        accountId,
        amount: Number(amount),
      });

      setStatus("success");
      setAmount("");
      fetchAccounts();

      // Reset success message after 3s
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center px-4 py-8">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[120px] pointer-events-none">
        <div className="h-80 w-80 rounded-full bg-emerald-600/30"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg rounded-[2.5rem] border border-white/10 bg-[#12141C]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/10">
            <WalletIcon className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-white">Deposit Funds</h1>
          <p className="mt-1 text-sm text-white/50">Select an account to add money.</p>
        </div>

        {/* Success Message (Overlay) */}
        {status === "success" && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-[2.5rem] bg-[#12141C]/95 backdrop-blur-md animate-in fade-in zoom-in duration-300">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-emerald-500 text-black shadow-xl shadow-emerald-500/40">
              <CheckIcon className="h-10 w-10" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-white">Deposit Successful!</h3>
            <p className="mt-2 text-white/50">Your funds have been added.</p>
            <button 
              onClick={() => setStatus("idle")}
              className="mt-8 rounded-xl bg-white/10 px-8 py-3 text-sm font-semibold text-white hover:bg-white/20"
            >
              Make another deposit
            </button>
          </div>
        )}

        <form onSubmit={submit} className="space-y-8">
          
          {/* 1. VISUAL ACCOUNT SELECTOR */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">To Account</label>
            {accounts.length === 0 ? (
               <div className="rounded-2xl border border-dashed border-white/20 p-6 text-center">
                  <p className="text-sm text-white/50">No accounts found.</p>
                  <Link to="/dashboard" className="mt-2 inline-block text-sm font-bold text-emerald-400 hover:underline">Create one +</Link>
               </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {accounts.map((acc) => (
                  <AccountOption 
                    key={acc._id} 
                    account={acc} 
                    isSelected={accountId === acc._id} 
                    onClick={() => setAccountId(acc._id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 2. AMOUNT INPUT & CHIPS */}
          <div className="space-y-4">
             <label className="text-xs font-bold uppercase tracking-widest text-white/40">Enter Amount</label>
             
             <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl text-white/30">₹</div>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  placeholder="0"
                  className="w-full rounded-3xl border border-white/10 bg-black/40 py-6 pl-14 pr-6 text-4xl font-bold text-white placeholder-white/10 outline-none transition-all focus:border-emerald-500/50 focus:bg-black/60 focus:shadow-lg focus:shadow-emerald-500/10"
                />
             </div>

             {/* Quick Chips */}
             <div className="flex flex-wrap gap-2">
               {[500, 1000, 5000].map((val) => (
                 <button
                   key={val}
                   type="button"
                   onClick={() => handleQuickAdd(val)}
                   className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 transition-all hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 active:scale-95"
                 >
                   + ₹{val.toLocaleString()}
                 </button>
               ))}
               <button
                  type="button"
                  onClick={() => setAmount("")}
                  className="ml-auto text-xs text-white/40 hover:text-white"
               >
                 Reset
               </button>
             </div>
          </div>

          {/* 3. SUBMIT BUTTON */}
          <button
            disabled={loading || !accountId || !amount || Number(amount) <= 0}
            className="group relative w-full overflow-hidden rounded-2xl bg-white py-4 text-base font-bold text-black transition-all hover:bg-emerald-50 hover:shadow-xl hover:shadow-emerald-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing...
              </span>
            ) : (
               "Confirm Deposit"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
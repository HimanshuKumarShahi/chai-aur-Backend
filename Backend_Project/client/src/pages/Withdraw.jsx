import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

// --- Icons ---
const CashIcon = ({ className }) => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 5.25h-.75m0 9c.341.02.685.05 1.027.086 9.302.989 18.028.636 24.993.038M15.75 9V4.5m-9 4.5V4.5m0 4.5A.75.75 0 016 9.75h.75a.75.75 0 01.75.75V11.25a.75.75 0 00.75.75h.75a.75.75 0 00.75-.75V10.5m3-1.5V9.75a.75.75 0 01.75.75h.75a.75.75 0 01.75.75V11.25a.75.75 0 00.75.75h.75a.75.75 0 00.75-.75V10.5m-10.5 6V15.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75V16.5m3-1.5V15.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75V16.5m3-1.5V15.75a.75.75 0 01.75-.75h.75a.75.75 0 01.75.75V16.5m-13.5-2.25l.003-.003.006-.006.006-.006.009-.009a67.576 67.576 0 0116.48-11.45" /></svg>;
const CheckIcon = ({ className }) => <svg fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;
const AlertIcon = ({ className }) => <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>;

// --- Components ---

// 1. Visual Account Selector Card (Rose Theme)
const AccountOption = ({ account, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 ${
      isSelected
        ? "border-rose-500 bg-rose-500/10 shadow-lg shadow-rose-500/10"
        : "border-white/5 bg-white/5 hover:bg-white/10"
    }`}
  >
    <div className="flex items-center justify-between">
      <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? "text-rose-400" : "text-white/50"}`}>
        {account.accountType}
      </span>
      {isSelected && <div className="rounded-full bg-rose-500 p-0.5"><CheckIcon className="h-3 w-3 text-black" /></div>}
    </div>
    <div className="mt-3">
      <p className="text-lg font-bold text-white">₹{account.balance.toLocaleString()}</p>
      <p className="text-xs text-white/40">•••• {String(account.accountNumber).slice(-4)}</p>
    </div>
  </div>
);

export default function Withdraw() {
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

  const handleQuickAmount = (val) => {
    setAmount(val.toString());
  };

  const getSelectedBalance = () => {
    const acc = accounts.find(a => a._id === accountId);
    return acc ? acc.balance : 0;
  };

  const isInsufficientFunds = () => {
    const balance = getSelectedBalance();
    return Number(amount) > balance;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!accountId || !amount) return;
    if (isInsufficientFunds()) {
        setStatus("error");
        return;
    }

    setLoading(true);
    setStatus("idle");

    try {
      await api.post("/transactions/withdraw", {
        accountId,
        amount: Number(amount),
      });

      setStatus("success");
      setAmount("");
      fetchAccounts();

      setTimeout(() => setStatus("idle"), 3000);
    } catch (err) {
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full items-center justify-center px-4 py-8">
      
      {/* Background Glow (Rose for Withdrawal) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[120px] pointer-events-none">
        <div className="h-80 w-80 rounded-full bg-rose-600/30"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg rounded-[2.5rem] border border-white/10 bg-[#12141C]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-rose-500/20 text-rose-400 shadow-lg shadow-rose-500/10">
            <CashIcon className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-white">Withdraw Funds</h1>
          <p className="mt-1 text-sm text-white/50">Select an account to withdraw from.</p>
        </div>

        {/* Success Message Overlay */}
        {status === "success" && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-[2.5rem] bg-[#12141C]/95 backdrop-blur-md animate-in fade-in zoom-in duration-300">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-rose-500 text-white shadow-xl shadow-rose-500/40">
              <CheckIcon className="h-10 w-10" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-white">Withdrawal Successful</h3>
            <p className="mt-2 text-white/50">Funds have been deducted.</p>
            <button 
              onClick={() => setStatus("idle")}
              className="mt-8 rounded-xl bg-white/10 px-8 py-3 text-sm font-semibold text-white hover:bg-white/20"
            >
              Close
            </button>
          </div>
        )}

        <form onSubmit={submit} className="space-y-8">
          
          {/* 1. VISUAL ACCOUNT SELECTOR */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">From Account</label>
            {accounts.length === 0 ? (
               <div className="rounded-2xl border border-dashed border-white/20 p-6 text-center">
                  <p className="text-sm text-white/50">No accounts found.</p>
                  <Link to="/dashboard" className="mt-2 inline-block text-sm font-bold text-rose-400 hover:underline">Create one +</Link>
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

          {/* 2. AMOUNT INPUT */}
          <div className="space-y-4">
             <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Withdraw Amount</label>
                <span className="text-xs text-rose-400 font-medium">
                    Max: ₹{getSelectedBalance().toLocaleString()}
                </span>
             </div>
             
             <div className="relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl text-white/30">₹</div>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  type="number"
                  placeholder="0"
                  className={`w-full rounded-3xl border py-6 pl-14 pr-6 text-4xl font-bold text-white placeholder-white/10 outline-none transition-all focus:bg-black/60 focus:shadow-lg ${
                    isInsufficientFunds() 
                        ? "border-red-500/50 bg-red-500/5 focus:border-red-500" 
                        : "border-white/10 bg-black/40 focus:border-rose-500/50 focus:shadow-rose-500/10"
                  }`}
                />
             </div>
             
             {/* Insufficient Funds Warning */}
             {isInsufficientFunds() && (
                <div className="flex items-center gap-2 text-red-400 text-sm animate-in fade-in slide-in-from-top-1">
                    <AlertIcon className="h-4 w-4" />
                    <span>Insufficient funds</span>
                </div>
             )}

             {/* Quick Chips */}
             <div className="flex flex-wrap gap-2">
               {[500, 2000, 5000].map((val) => (
                 <button
                   key={val}
                   type="button"
                   onClick={() => handleQuickAmount(val)}
                   className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 transition-all hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-400 active:scale-95"
                 >
                   ₹{val.toLocaleString()}
                 </button>
               ))}
               <button
                  type="button"
                  onClick={() => setAmount(getSelectedBalance().toString())}
                  className="rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-300 transition-all hover:bg-rose-500/20"
               >
                 Max
               </button>
             </div>
          </div>

          {/* 3. SUBMIT BUTTON */}
          <button
            disabled={loading || !accountId || !amount || Number(amount) <= 0 || isInsufficientFunds()}
            className="group relative w-full overflow-hidden rounded-2xl bg-white py-4 text-base font-bold text-black transition-all hover:bg-rose-50 hover:shadow-xl hover:shadow-rose-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing...
              </span>
            ) : (
               "Confirm Withdrawal"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
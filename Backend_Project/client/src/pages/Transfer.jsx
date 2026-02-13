import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

// --- Icons ---
const PaperAirplaneIcon = ({ className }) => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>;
const CheckIcon = ({ className }) => <svg fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>;
const UserIcon = ({ className }) => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
const AlertIcon = ({ className }) => <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>;

// --- Components ---

// 1. Visual Account Selector Card (Indigo Theme)
const AccountOption = ({ account, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`cursor-pointer relative overflow-hidden rounded-2xl border p-4 transition-all duration-200 ${
      isSelected
        ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
        : "border-white/5 bg-white/5 hover:bg-white/10"
    }`}
  >
    <div className="flex items-center justify-between">
      <span className={`text-xs font-bold uppercase tracking-wider ${isSelected ? "text-indigo-400" : "text-white/50"}`}>
        {account.accountType}
      </span>
      {isSelected && <div className="rounded-full bg-indigo-500 p-0.5"><CheckIcon className="h-3 w-3 text-black" /></div>}
    </div>
    <div className="mt-3">
      <p className="text-lg font-bold text-white">₹{account.balance.toLocaleString()}</p>
      <p className="text-xs text-white/40">•••• {String(account.accountNumber).slice(-4)}</p>
    </div>
  </div>
);

export default function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountNumber, setToAccountNumber] = useState("");
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
      if (list.length > 0 && !fromAccountId) setFromAccountId(list[0]._id);
    } catch (err) {
      console.error("Failed to load accounts");
    }
  };

  const getSelectedBalance = () => {
    const acc = accounts.find(a => a._id === fromAccountId);
    return acc ? acc.balance : 0;
  };

  const isInsufficientFunds = () => {
    const balance = getSelectedBalance();
    return Number(amount) > balance;
  };

  const handleQuickAmount = (val) => {
      setAmount(val.toString());
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!fromAccountId || !toAccountNumber || !amount) return;
    if (isInsufficientFunds()) {
        setStatus("error");
        return;
    }

    setLoading(true);
    setStatus("idle");

    try {
      await api.post("/transactions/transfer", {
        fromAccountId,
        toAccountNumber: Number(toAccountNumber),
        amount: Number(amount),
      });

      setStatus("success");
      setAmount("");
      setToAccountNumber("");
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
      
      {/* Background Glow (Indigo for Transfer) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20 blur-[120px] pointer-events-none">
        <div className="h-80 w-80 rounded-full bg-indigo-600/30"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg rounded-[2.5rem] border border-white/10 bg-[#12141C]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-indigo-500/20 text-indigo-400 shadow-lg shadow-indigo-500/10">
            <PaperAirplaneIcon className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-white">Transfer Money</h1>
          <p className="mt-1 text-sm text-white/50">Send funds securely to another user.</p>
        </div>

        {/* Success Message Overlay */}
        {status === "success" && (
          <div className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-[2.5rem] bg-[#12141C]/95 backdrop-blur-md animate-in fade-in zoom-in duration-300">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-indigo-500 text-white shadow-xl shadow-indigo-500/40">
              <CheckIcon className="h-10 w-10" />
            </div>
            <h3 className="mt-6 text-2xl font-bold text-white">Transfer Successful!</h3>
            <p className="mt-2 text-white/50">₹{amount} sent to Account {toAccountNumber}</p>
            <button 
              onClick={() => setStatus("idle")}
              className="mt-8 rounded-xl bg-white/10 px-8 py-3 text-sm font-semibold text-white hover:bg-white/20"
            >
              Send Another
            </button>
          </div>
        )}

        <form onSubmit={submit} className="space-y-8">
          
          {/* 1. VISUAL FROM ACCOUNT SELECTOR */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-white/40">From Account</label>
            {accounts.length === 0 ? (
               <div className="rounded-2xl border border-dashed border-white/20 p-6 text-center">
                  <p className="text-sm text-white/50">No accounts found.</p>
                  <Link to="/dashboard" className="mt-2 inline-block text-sm font-bold text-indigo-400 hover:underline">Create one +</Link>
               </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {accounts.map((acc) => (
                  <AccountOption 
                    key={acc._id} 
                    account={acc} 
                    isSelected={fromAccountId === acc._id} 
                    onClick={() => setFromAccountId(acc._id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* 2. RECEIVER ACCOUNT NUMBER */}
          <div className="space-y-3">
             <label className="text-xs font-bold uppercase tracking-widest text-white/40">To Account Number</label>
             <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                    <UserIcon className="h-5 w-5" />
                </div>
                <input 
                    value={toAccountNumber}
                    onChange={(e) => setToAccountNumber(e.target.value)}
                    type="number"
                    placeholder="e.g. 5768836288"
                    className="w-full rounded-2xl border border-white/10 bg-black/40 py-4 pl-12 pr-4 text-white placeholder-white/20 outline-none transition-all focus:border-indigo-500/50 focus:bg-black/60 focus:shadow-lg focus:shadow-indigo-500/10"
                />
             </div>
          </div>

          {/* 3. AMOUNT INPUT */}
          <div className="space-y-4">
             <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-white/40">Amount</label>
                <span className="text-xs text-indigo-400 font-medium">
                    Balance: ₹{getSelectedBalance().toLocaleString()}
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
                        : "border-white/10 bg-black/40 focus:border-indigo-500/50 focus:shadow-indigo-500/10"
                  }`}
                />
             </div>
             
             {isInsufficientFunds() && (
                <div className="flex items-center gap-2 text-red-400 text-sm animate-in fade-in slide-in-from-top-1">
                    <AlertIcon className="h-4 w-4" />
                    <span>Insufficient funds</span>
                </div>
             )}

             {/* Quick Chips */}
             <div className="flex flex-wrap gap-2">
               {[500, 1000, 5000].map((val) => (
                 <button
                   key={val}
                   type="button"
                   onClick={() => handleQuickAmount(val)}
                   className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70 transition-all hover:border-indigo-500/30 hover:bg-indigo-500/10 hover:text-indigo-400 active:scale-95"
                 >
                   ₹{val.toLocaleString()}
                 </button>
               ))}
             </div>
          </div>

          {/* 4. SUBMIT BUTTON */}
          <button
            disabled={loading || !fromAccountId || !toAccountNumber || !amount || Number(amount) <= 0 || isInsufficientFunds()}
            className="group relative w-full overflow-hidden rounded-2xl bg-white py-4 text-base font-bold text-black transition-all hover:bg-indigo-50 hover:shadow-xl hover:shadow-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Processing...
              </span>
            ) : (
               "Send Money"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
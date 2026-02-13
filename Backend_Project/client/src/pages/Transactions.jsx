import { useEffect, useState } from "react";
import api from "../api/api";

// --- Icons ---
const RefreshIcon = ({ className }) => <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>;
const ArrowDownLeft = ({ className }) => <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 4.5l-15 15m0 0h11.25m-11.25 0V8.25" /></svg>; // Deposit
const ArrowUpRight = ({ className }) => <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>; // Withdraw
const ArrowsRightLeft = ({ className }) => <svg fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg>; // Transfer
const ReceiptIcon = ({ className }) => <svg fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>;

export default function Transactions() {
  const [tx, setTx] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTx = async () => {
    setLoading(true);
    try {
      const res = await api.get("/transactions/my");
      // Sort by newest first
      const sorted = (res.data.transactions || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTx(sorted);
    } catch (err) {
      console.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTx();
  }, []);

  // Helper to style transaction types
  const getTypeStyles = (type) => {
    switch (type.toLowerCase()) {
      case "deposit":
        return {
          icon: <ArrowDownLeft className="h-4 w-4" />,
          color: "text-emerald-400",
          bg: "bg-emerald-500/10 border-emerald-500/20",
          label: "Received",
        };
      case "withdraw":
        return {
          icon: <ArrowUpRight className="h-4 w-4" />,
          color: "text-rose-400",
          bg: "bg-rose-500/10 border-rose-500/20",
          label: "Sent",
        };
      default: // Transfer
        return {
          icon: <ArrowsRightLeft className="h-4 w-4" />,
          color: "text-indigo-400",
          bg: "bg-indigo-500/10 border-indigo-500/20",
          label: "Transfer",
        };
    }
  };

  // Helper to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] w-full items-start justify-center px-4 py-10">
      
      {/* Background Glow */}
      <div className="absolute top-20 right-0 h-96 w-96 rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-6xl space-y-6">
        
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Transaction History</h1>
            <p className="mt-1 text-sm text-white/50">
              Track your financial activity securely.
            </p>
          </div>

          <button
            onClick={fetchTx}
            className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-white/10 hover:shadow-lg"
          >
            <RefreshIcon className={`h-4 w-4 text-white/70 transition-transform ${loading ? "animate-spin" : "group-hover:rotate-180"}`} />
            Refresh List
          </button>
        </div>

        {/* Content Card */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#12141C]/80 shadow-2xl backdrop-blur-xl">
          
          {loading ? (
            // Skeleton Loader
            <div className="space-y-4 p-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex h-16 w-full animate-pulse items-center justify-between rounded-xl bg-white/5 px-4"></div>
              ))}
            </div>
          ) : tx.length === 0 ? (
            // Empty State
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-white/5">
                <ReceiptIcon className="h-8 w-8 text-white/30" />
              </div>
              <h3 className="text-lg font-medium text-white">No transactions yet</h3>
              <p className="mt-1 text-sm text-white/40">Your deposits and transfers will appear here.</p>
            </div>
          ) : (
            // Data Table
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-white/70">
                <thead className="bg-white/5 text-xs uppercase tracking-wider text-white/40">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Type</th>
                    <th className="px-6 py-4 font-semibold">Amount</th>
                    <th className="px-6 py-4 font-semibold">From</th>
                    <th className="px-6 py-4 font-semibold">To</th>
                    <th className="px-6 py-4 font-semibold text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {tx.map((t) => {
                    const style = getTypeStyles(t.type);
                    const { date, time } = formatDate(t.createdAt);
                    
                    return (
                      <tr 
                        key={t._id} 
                        className="group transition-colors hover:bg-white/5"
                      >
                        {/* Type Column */}
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`grid h-8 w-8 place-items-center rounded-lg border ${style.bg} ${style.color}`}>
                              {style.icon}
                            </div>
                            <div>
                              <p className="font-bold text-white capitalize">{t.type}</p>
                              <p className="text-xs text-white/40">{style.label}</p>
                            </div>
                          </div>
                        </td>

                        {/* Amount Column */}
                        <td className="whitespace-nowrap px-6 py-4">
                          <span className={`font-mono text-base font-bold tracking-tight ${style.color}`}>
                            {t.type === "Withdraw" ? "-" : "+"} ₹{t.amount.toLocaleString()}
                          </span>
                        </td>

                        {/* From Column */}
                        <td className="whitespace-nowrap px-6 py-4">
                          {t.fromAccountNumber ? (
                             <span className="font-mono text-xs text-white/60 bg-white/5 px-2 py-1 rounded">
                               •••• {String(t.fromAccountNumber).slice(-4)}
                             </span>
                          ) : (
                             <span className="text-xs text-white/30">—</span>
                          )}
                        </td>

                        {/* To Column */}
                        <td className="whitespace-nowrap px-6 py-4">
                           {t.toAccountNumber ? (
                             <span className="font-mono text-xs text-white/60 bg-white/5 px-2 py-1 rounded">
                               •••• {String(t.toAccountNumber).slice(-4)}
                             </span>
                          ) : (
                             <span className="text-xs text-white/30">—</span>
                          )}
                        </td>

                        {/* Date Column */}
                        <td className="whitespace-nowrap px-6 py-4 text-right">
                          <p className="text-sm font-medium text-white">{date}</p>
                          <p className="text-xs text-white/40">{time}</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
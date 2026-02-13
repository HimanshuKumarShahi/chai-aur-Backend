import { useEffect, useState } from "react";
import api from "../api/api";

export default function Transactions() {
  const [tx, setTx] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTx = async () => {
    try {
      const res = await api.get("/transactions/my");
      setTx(res.data.transactions || []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTx();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-white">Transactions</h1>
            <p className="mt-1 text-sm text-white/50">
              Your deposit, withdraw, and transfers.
            </p>
          </div>

          <button
            onClick={fetchTx}
            className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/15"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="mt-6 text-white/60">Loading...</p>
        ) : tx.length === 0 ? (
          <p className="mt-6 text-white/60">No transactions yet.</p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm text-white/80">
              <thead className="text-xs text-white/50">
                <tr className="border-b border-white/10">
                  <th className="py-3">Type</th>
                  <th>Amount</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {tx.map((t) => (
                  <tr
                    key={t._id}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="py-3">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs">
                        {t.type}
                      </span>
                    </td>
                    <td>₹{t.amount}</td>
                    <td>{t.fromAccountNumber || "-"}</td>
                    <td>{t.toAccountNumber || "-"}</td>
                    <td>{new Date(t.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

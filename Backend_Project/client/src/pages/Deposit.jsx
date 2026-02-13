import { useEffect, useState } from "react";
import api from "../api/api";

export default function Deposit() {
  const [accounts, setAccounts] = useState([]);
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAccounts = async () => {
    try {
      const res = await api.get("/accounts/my");
      const list = res.data.accounts || [];
      setAccounts(list);

      // auto-select first account
      if (list.length > 0) setAccountId(list[0]._id);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load accounts");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    if (!accountId) return alert("Please select an account");
    if (!amount || Number(amount) <= 0) return alert("Enter valid amount");

    setLoading(true);
    try {
      const res = await api.post("/transactions/deposit", {
        accountId,
        amount: Number(amount),
      });

      alert(res.data.message || "Deposit successful");
      setAmount("");
      fetchAccounts();
    } catch (err) {
      alert(err.response?.data?.message || "Deposit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="max-w-xl rounded-3xl border border-white/10 bg-white/5 p-7 shadow-xl">
        <h1 className="text-2xl font-semibold text-white">Deposit</h1>
        <p className="mt-1 text-sm text-white/50">
          Add money into one of your accounts.
        </p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-white/70">Select Account</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none focus:border-white/20"
            >
              {accounts.length === 0 ? (
                <option value="">No accounts found</option>
              ) : (
                accounts.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.accountType} - {a.accountNumber} (₹{a.balance})
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="text-sm text-white/70">Amount</label>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              type="number"
              className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/30 focus:border-white/20"
              placeholder="Enter amount"
              min="1"
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black hover:bg-white/90 disabled:opacity-60"
          >
            {loading ? "Depositing..." : "Deposit Money"}
          </button>
        </form>

        {accounts.length === 0 ? (
          <p className="mt-4 text-xs text-red-200">
            You must create an account first (Savings/Current).
          </p>
        ) : null}
      </div>
    </div>
  );
}

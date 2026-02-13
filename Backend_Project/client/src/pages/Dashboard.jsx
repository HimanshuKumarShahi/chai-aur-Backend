import { useEffect, useMemo, useState } from "react";
import api from "../api/api";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      const res = await api.get("/accounts/my");
      setAccounts(res.data.accounts || []);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const totalBalance = useMemo(() => {
    return accounts.reduce((sum, a) => sum + Number(a.balance || 0), 0);
  }, [accounts]);

  const createAccount = async (type) => {
    try {
      await api.post("/accounts/create", { accountType: type });
      await fetchAccounts();
    } catch (err) {
      alert(err.response?.data?.message || "Create account failed");
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-white/50">
            Manage your accounts and money.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => createAccount("Savings")}
            className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black hover:bg-white/90"
          >
            + Savings
          </button>
          <button
            onClick={() => createAccount("Current")}
            className="rounded-2xl bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/15"
          >
            + Current
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard title="Total Balance" value={`₹${totalBalance}`} sub="All accounts" />
        <StatCard title="Accounts" value={accounts.length} sub="Savings + Current" />
        <StatCard title="Status" value="Active" sub="JWT Protected" />
      </div>

      <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-white">Your Accounts</p>
          <button
            onClick={fetchAccounts}
            className="rounded-xl bg-white/10 px-3 py-2 text-sm text-white hover:bg-white/15"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="mt-6 text-white/60">Loading...</p>
        ) : accounts.length === 0 ? (
          <p className="mt-6 text-white/60">
            No accounts found. Create one to start.
          </p>
        ) : (
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {accounts.map((acc) => (
              <div
                key={acc._id}
                className="rounded-2xl border border-white/10 bg-black/20 p-5"
              >
                <p className="text-sm text-white/60">{acc.accountType} Account</p>
                <p className="mt-2 text-xl font-semibold text-white">
                  ₹{acc.balance}
                </p>
                <p className="mt-2 text-sm text-white/50">
                  Account No:{" "}
                  <span className="text-white">{acc.accountNumber}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

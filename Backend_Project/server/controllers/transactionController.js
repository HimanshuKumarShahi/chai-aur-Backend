import Account from "../models/Account.models.js";
import Transaction from "../models/Transaction.models.js";

export const deposit = async (req, res) => {
  try {
    const { accountId, amount } = req.body;
    if (!accountId || !amount || Number(amount) <= 0)
      return res.status(400).json({ message: "Valid accountId and amount required" });

    const account = await Account.findOne({ _id: accountId, userId: req.user._id });
    if (!account) return res.status(404).json({ message: "Account not found" });

    account.balance += Number(amount);
    await account.save();

    await Transaction.create({ accountId: account._id, type: "Deposit", amount: Number(amount) });

    res.status(200).json({ message: "Deposit successful", balance: account.balance });
  } catch (error) {
    res.status(500).json({ message: "Deposit failed", error: error.message });
  }
};

export const withdraw = async (req, res) => {
  try {
    const { accountId, amount } = req.body;
    if (!accountId || !amount || Number(amount) <= 0)
      return res.status(400).json({ message: "Valid accountId and amount required" });

    const account = await Account.findOne({ _id: accountId, userId: req.user._id });
    if (!account) return res.status(404).json({ message: "Account not found" });
    if (account.balance < Number(amount))
      return res.status(400).json({ message: "Insufficient balance" });

    account.balance -= Number(amount);
    await account.save();

    await Transaction.create({ accountId: account._id, type: "Withdrawal", amount: Number(amount) });

    res.status(200).json({ message: "Withdrawal successful", balance: account.balance });
  } catch (error) {
    res.status(500).json({ message: "Withdrawal failed", error: error.message });
  }
};

export const transfer = async (req, res) => {
  try {
    const { fromAccountId, toAccountNumber, amount } = req.body;
    if (!fromAccountId || !toAccountNumber || !amount || Number(amount) <= 0)
      return res.status(400).json({ message: "All fields required" });

    const sender = await Account.findOne({ _id: fromAccountId, userId: req.user._id });
    const receiver = await Account.findOne({ accountNumber: Number(toAccountNumber) });

    if (!sender) return res.status(404).json({ message: "Sender account not found" });
    if (!receiver) return res.status(404).json({ message: "Receiver account not found" });
    if (sender.balance < Number(amount)) return res.status(400).json({ message: "Insufficient funds" });

    sender.balance -= Number(amount);
    receiver.balance += Number(amount);

    await sender.save();
    await receiver.save();

    await Transaction.create({
      accountId: sender._id,
      type: "Transfer",
      amount: Number(amount),
      toAccount: Number(toAccountNumber),
    });

    res.status(200).json({ message: "Transfer successful", remainingBalance: sender.balance });
  } catch (error) {
    res.status(500).json({ message: "Transfer failed", error: error.message });
  }
};

export const myTransactions = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user._id }).select("_id");
    const ids = accounts.map(a => a._id);

    const transactions = await Transaction.find({ accountId: { $in: ids } }).sort({ createdAt: -1 });
    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: "Fetch failed", error: error.message });
  }
};

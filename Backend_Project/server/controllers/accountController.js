import Account from "../models/Account.models.js";

const generateAccountNumber = () => Math.floor(1000000000 + Math.random() * 9000000000);

export const createAccount = async (req, res) => {
  try {
    const { accountType } = req.body;

    // FIX: Limit accounts to 3 per user to prevent spam
    const existingAccountsCount = await Account.countDocuments({ userId: req.user._id });
    if (existingAccountsCount >= 3) {
      return res.status(400).json({ message: "Limit reached: You can only have 3 accounts." });
    }

    // FIX: Check if an account of this type already exists for the user
    const typeExists = await Account.findOne({ userId: req.user._id, accountType: accountType || "Savings" });
    if (typeExists) {
      return res.status(400).json({ message: `You already have a ${accountType || "Savings"} account.` });
    }

    const account = await Account.create({
      userId: req.user._id,
      accountType: accountType || "Savings",
      accountNumber: generateAccountNumber(),
      balance: 0,
    });

    res.status(201).json({ message: "Account created successfully", account });
  } catch (error) {
    res.status(500).json({ message: "Create failed", error: error.message });
  }
};

export const getMyAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ accounts });
  } catch (error) {
    res.status(500).json({ message: "Fetch failed", error: error.message });
  }
};

export const getBalance = async (req, res) => {
  try {
    const { accountId } = req.query;
    if (!accountId) return res.status(400).json({ message: "accountId is required" });

    const account = await Account.findOne({ _id: accountId, userId: req.user._id });
    if (!account) return res.status(404).json({ message: "Account not found" });

    res.status(200).json({ accountId: account._id, balance: account.balance });
  } catch (error) {
    res.status(500).json({ message: "Balance failed", error: error.message });
  }
};

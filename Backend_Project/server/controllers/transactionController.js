import mongoose from "mongoose";
import Account from "../models/Account.models.js";
import Transaction from "../models/Transaction.models.js";
import connectDB from "../config/db.js";

// 1. DEPOSIT: Atomic update
export const deposit = async (req, res) => {
  try {
    await connectDB();
    const { accountId, amount } = req.body;
    const depositAmount = Number(amount);

    if (!accountId || depositAmount <= 0) {
      return res.status(400).json({ message: "Invalid account or amount" });
    }

    const account = await Account.findOneAndUpdate(
      { _id: accountId, userId: req.user._id },
      { $inc: { balance: depositAmount } },
      { new: true }
    );

    if (!account) return res.status(404).json({ message: "Account not found" });

    await Transaction.create({
      accountId: account._id,
      type: "Deposit",
      amount: depositAmount,
      status: "Success"
    });

    res.status(200).json({ message: "Deposit successful", balance: account.balance });
  } catch (error) {
    res.status(500).json({ message: "Deposit failed", error: error.message });
  }
};

// 2. WITHDRAW: Atomic balance check (Prevents Race Conditions)
export const withdraw = async (req, res) => {
  try {
    await connectDB();
    const { accountId, amount } = req.body;
    const withdrawAmount = Number(amount);

    if (!accountId || withdrawAmount <= 0) {
      return res.status(400).json({ message: "Invalid account or amount" });
    }

    // FIX: The balance check is now part of the query filter { balance: { $gte: withdrawAmount } }
    // This ensures that even if 100 requests hit at once, they won't over-draw the account.
    const account = await Account.findOneAndUpdate(
      { 
        _id: accountId, 
        userId: req.user._id, 
        balance: { $gte: withdrawAmount } 
      },
      { $inc: { balance: -withdrawAmount } },
      { new: true }
    );

    if (!account) {
      return res.status(400).json({ message: "Insufficient balance or account not found" });
    }

    await Transaction.create({
      accountId: account._id,
      type: "Withdrawal",
      amount: withdrawAmount,
      status: "Success"
    });

    res.status(200).json({ message: "Withdrawal successful", balance: account.balance });
  } catch (error) {
    res.status(500).json({ message: "Withdrawal failed", error: error.message });
  }
};

// 3. TRANSFER: ACID Transaction (Prevents Money Glitches)
export const transfer = async (req, res) => {
  await connectDB();
  
  // Start a Mongoose Session for the transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { fromAccountId, toAccountNumber, amount } = req.body;
    const transferAmount = Number(amount);

    if (!fromAccountId || !toAccountNumber || transferAmount <= 0) {
      throw new Error("Invalid transfer details");
    }

    // Find accounts within the session
    const sender = await Account.findOne({ _id: fromAccountId, userId: req.user._id }).session(session);
    const receiver = await Account.findOne({ accountNumber: Number(toAccountNumber) }).session(session);

    if (!sender) throw new Error("Sender account not found");
    if (!receiver) throw new Error("Receiver account not found");

    // FIX: Prevent self-transfer (checking both ID and Account Number)
    if (sender.accountNumber === Number(toAccountNumber)) {
      throw new Error("Cannot transfer to the same account");
    }

    // Check balance
    if (sender.balance < transferAmount) {
      throw new Error("Insufficient funds");
    }

    // Perform the updates ATOMICALLY within the session
    const updatedSender = await Account.findOneAndUpdate(
      { _id: sender._id },
      { $inc: { balance: -transferAmount } },
      { new: true, session }
    );

    await Account.findOneAndUpdate(
      { _id: receiver._id },
      { $inc: { balance: transferAmount } },
      { session }
    );

    // Log the transaction within the session
    await Transaction.create([{
      accountId: sender._id,
      type: "Transfer",
      amount: transferAmount,
      toAccount: Number(toAccountNumber),
      status: "Success"
    }], { session });

    // Commit changes to the database
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ 
      message: "Transfer successful", 
      remainingBalance: updatedSender.balance 
    });

  } catch (error) {
    // If ANY part fails, undo EVERYTHING automatically
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: "Transfer failed", error: error.message });
  }
};

// 4. MY TRANSACTIONS
export const myTransactions = async (req, res) => {
  try {
    await connectDB();
    const accounts = await Account.find({ userId: req.user._id }).select("_id");
    const ids = accounts.map(a => a._id);

    const transactions = await Transaction.find({ accountId: { $in: ids } })
      .sort({ createdAt: -1 });

    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: "Fetch failed", error: error.message });
  }
};
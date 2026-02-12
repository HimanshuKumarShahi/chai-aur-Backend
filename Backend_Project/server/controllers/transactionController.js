import Account from "../models/Account.models.js";
import Transaction from '../models/Transaction.models.js'

export const deposit = async (req, res) => {
    try {
        const { amount } = req.body;
        if (amount <= 0) return res.status(400).json({ message: "Invalid amount" });

        const account = await Account.findOne({ userId: req.user._id });
        if (!account) return res.status(404).json({ message: "Account not found" });

        
        account.balance += Number(amount);
        await account.save();

    
        await Transaction.create({
            accountId: account._id,
            type: 'Deposit',
            amount
        });

        res.status(200).json({ message: "Deposit successful", balance: account.balance });
    } catch (error) {
        res.status(500).json({ message: "Deposit failed", error: error.message });
    }
};

export const withdraw = async (req, res) => {
    try {
        let { amount } = req.body;
        
        // 1. Force amount to be a Number immediately
        amount = Number(amount); 

        const account = await Account.findOne({ userId: req.user._id });

        if (!account) {
            return res.status(404).json({ message: "Account not found" });
        }

        // 2. Log values to console for debugging
        console.log(`Current Balance: ${account.balance}, Requested Withdraw: ${amount}`);

        if (account.balance < amount) {
            return res.status(400).json({ message: `Insufficient funds. Your balance is ${account.balance}` });
        }

        account.balance -= amount;
        await account.save();

        await Transaction.create({
            accountId: account._id,
            type: 'Withdrawal',
            amount
        });

        res.status(200).json({ message: "Withdrawal successful", balance: account.balance });
    } catch (error) {
        res.status(500).json({ message: "Withdrawal failed", error: error.message });
    }
};

export const transfer = async (req, res) => {
    try {
        const { toAccountNumber, amount } = req.body;
        const sender = await Account.findOne({ userId: req.user._id });
        const receiver = await Account.findOne({ accountNumber: toAccountNumber });

        if (!sender) return res.status(404).json({ message: "Sender account not found" });
        if (!receiver) return res.status(404).json({ message: "Receiver account not found" });
        if (sender.balance < amount) return res.status(400).json({ message: "Insufficient funds" });

        
        sender.balance -= Number(amount);
        await sender.save();

        
        receiver.balance += Number(amount);
        await receiver.save();

        
        await Transaction.create({
            accountId: sender._id,
            type: 'Transfer',
            amount,
            toAccount: toAccountNumber
        });

        res.status(200).json({ message: "Transfer successful", remainingBalance: sender.balance });
    } catch (error) {
        res.status(500).json({ message: "Transfer failed", error: error.message });
    }
};
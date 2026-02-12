import Account from "../models/Account.models.js";

export const createAccount = async (req, res) => {
    try {
        const { accountType } = req.body;
        
    
        const existingAccount = await Account.findOne({ userId: req.user._id });
        if (existingAccount) {
            return res.status(400).json({ message: "User already has an account" });
        }

        
        const accountNumber = Math.floor(100000000 + Math.random() * 900000000);

        const account = await Account.create({
            userId: req.user._id,
            accountType,
            accountNumber,
            balance: 0 
        });

        res.status(201).json({ message: "Account created successfully", account });
    } catch (error) {
        res.status(500).json({ message: "Error creating account", error: error.message });
    }
};

export const getBalance = async (req, res) => {
    try {
        const account = await Account.findOne({ userId: req.user._id });
        if (!account) return res.status(404).json({ message: "No account found" });

        res.status(200).json({ 
            accountNumber: account.accountNumber,
            balance: account.balance 
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
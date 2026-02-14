import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    accountType: { type: String, enum: ["Savings", "Current"], default: "Savings" },
    accountNumber: { type: Number, required: true, unique: true },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Account = mongoose.model("Account", accountSchema);
export default Account;

import mongoose from "mongoose";
const transactionSchema=new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    },
    type: {
        type: String,
        enum: ['Deposit', 'Withdrawal', 'Transfer'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    toAccount: { 
        type: Number, 
        default: null
    },
    status: {
        type: String,
        default: 'Success'
    }
},{
    timestamps:true
})

const Transaction=mongoose.model('Transaction',transactionSchema)
export default Transaction;
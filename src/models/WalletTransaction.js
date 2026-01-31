import mongoose from 'mongoose';

const walletTransactionSchema = new mongoose.Schema({
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    type: { type: String, enum: ['credit', 'debit'], required: true }, // credit = add money, debit = deduct
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'], default: 'pending' },
    method: { type: String, enum: ['bank_transfer', 'card', 'cash', 'bonus', 'initial_deposit', 'trip_deduction'], default: 'bank_transfer' },
    receiptUrl: { type: String }, // For bank transfers
    description: { type: String },
    adminNote: { type: String },
    processedBy: { type: String } // Admin ID/Name
}, { timestamps: true });

const WalletTransaction = mongoose.models.WalletTransaction || mongoose.model('WalletTransaction', walletTransactionSchema);

export default WalletTransaction;

import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    amount: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    description: { type: String, required: true },
    receiptUrl: { type: String }, // For top-ups
    referenceId: { type: mongoose.Schema.Types.ObjectId }, // Booking ID or other ref
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
    performedBy: { type: String } // Admin name or 'System'
}, {
    timestamps: true
});

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);

export default Transaction;

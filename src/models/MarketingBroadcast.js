import mongoose from 'mongoose';

const MarketingBroadcastSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    recipientCount: { type: Number, required: true },
    couponCodes: [String],
    sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['pending', 'sending', 'completed', 'failed'], default: 'pending' },
    error: { type: String }
}, { timestamps: true });

export default mongoose.models.MarketingBroadcast || mongoose.model('MarketingBroadcast', MarketingBroadcastSchema);

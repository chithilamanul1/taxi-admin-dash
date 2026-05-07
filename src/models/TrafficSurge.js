import mongoose from 'mongoose';

const TrafficSurgeSchema = new mongoose.Schema({
    startTime: {
        type: String, // format "HH:mm" (24h)
        required: true
    },
    endTime: {
        type: String, // format "HH:mm" (24h)
        required: true
    },
    percentage: {
        type: Number,
        required: true,
        default: 0
    },
    label: {
        type: String,
        default: 'Peak Hour Surge'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    daysOfWeek: {
        type: [Number], // 0-6 (Sunday-Saturday)
        default: [0, 1, 2, 3, 4, 5, 6]
    }
}, { timestamps: true });

export default mongoose.models.TrafficSurge || mongoose.model('TrafficSurge', TrafficSurgeSchema);

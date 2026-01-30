import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    sender: {
        type: String,
        enum: ['user', 'admin'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const SupportTicketSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Allow guest tickets if needed in future, but primarily for logged in users
    },
    guestDetails: {
        name: String,
        email: String,
        phone: String
    },
    subject: {
        type: String,
        required: [true, 'Please provide a subject']
    },
    status: {
        type: String,
        enum: ['open', 'pending_user', 'resolved'],
        default: 'open'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    messages: [MessageSchema]
}, {
    timestamps: true
});

export default mongoose.models.SupportTicket || mongoose.model('SupportTicket', SupportTicketSchema);

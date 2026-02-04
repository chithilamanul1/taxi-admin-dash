import mongoose from 'mongoose';

const ChatMessageSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true,
        index: true
    },
    text: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        enum: ['customer', 'admin'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const ChatSessionSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true,
        unique: true
    },
    customerName: {
        type: String,
        default: 'Guest User'
    },
    lastMessage: String,
    lastSender: String,
    status: {
        type: String,
        enum: ['active', 'closed'],
        default: 'active'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

export const ChatMessage = mongoose.models.ChatMessage || mongoose.model('ChatMessage', ChatMessageSchema);
export const ChatSession = mongoose.models.ChatSession || mongoose.model('ChatSession', ChatSessionSchema);

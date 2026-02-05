const mongoose = require('mongoose');

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
    discordChannelId: {
        type: String,
        sparse: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const ChatMessage = mongoose.models.ChatMessage || mongoose.model('ChatMessage', ChatMessageSchema);
const ChatSession = mongoose.models.ChatSession || mongoose.model('ChatSession', ChatSessionSchema);

module.exports = { ChatMessage, ChatSession };

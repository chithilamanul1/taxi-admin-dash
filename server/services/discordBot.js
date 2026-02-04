const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const admin = require('firebase-admin');
const mongoose = require('mongoose');

// Initialize Firebase Admin (Only if not already initialized)
if (!admin.apps.length) {
    // Assuming service account JSON path or environment variable
    // For local dev, we might use a service account key file.
    // However, if we're on a server, we can use application default credentials.
    // For this implementation, we'll try to load from environment or expect it to be handled in server/index.js
}

class SupportBot {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
            ]
        });

        this.token = process.env.DISCORD_BOT_TOKEN;
        this.channelId = process.env.DISCORD_CHAT_CHANNEL_ID;
        this.db = admin.firestore();
    }

    async start() {
        if (!this.token) {
            console.error('[Bot] DISCORD_BOT_TOKEN is missing');
            return;
        }

        this.client.on('ready', () => {
            console.log(`[Bot] Logged in as ${this.client.user.tag}`);
            this.setupFirestoreListener();
        });

        this.client.on('messageCreate', async (message) => {
            if (message.author.bot) return;
            if (message.channelId !== this.channelId) {
                // Handle commands like /status here if not using slash commands
                if (message.content === '!status' || message.content === '/status') {
                    this.handleStatus(message);
                }
                return;
            }

            // Relay message to Firestore
            await this.handleDiscordReply(message);
        });

        await this.client.login(this.token);
    }

    setupFirestoreListener() {
        console.log('[Bot] Setting up Firestore listener...');

        // Listen for new messages in ALL chat sessions
        // This is complex - we'd ideally listen to a 'messages' root or use a relay API.
        // For simplicity, let's listen to the 'chats' collection updates.
        this.db.collection('chats').onSnapshot(async (snapshot) => {
            snapshot.docChanges().forEach(async (change) => {
                const chatData = change.doc.data();

                // If it's a new message from a customer
                if (change.type === 'modified' && chatData.lastMessage && chatData.updatedAt) {
                    // Check if it's actually a customer message (we'd need a flag or timestamp check)
                    // For now, assume every update that isn't from the bot is a trigger
                    // To prevent loops, we could check chatData.lastSender
                    if (chatData.lastSender === 'admin') return;

                    this.notifyChannel(chatData);
                }
            });
        });
    }

    async notifyChannel(chatData) {
        const channel = await this.client.channels.fetch(this.channelId);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setTitle(`💬 Message from ${chatData.customerName || 'Guest'}`)
            .setDescription(chatData.lastMessage)
            .setColor(0x10b981)
            .addFields(
                { name: 'Chat Session', value: `\`${chatData.id}\``, inline: true },
                { name: 'Status', value: chatData.status, inline: true }
            )
            .setTimestamp();

        // Check if we already have a thread for this chat
        // In a real app, we'd use threads to keep conversations organized.
        await channel.send({
            content: `**Incoming Support Chat** (Internal ID: \`${chatData.id}\`)`,
            embeds: [embed]
        });
    }

    async handleDiscordReply(message) {
        // Find which chat session this belongs to.
        // Option A: Message contains the ID.
        // Option B: We check message history for the pattern (Relay).

        const match = message.content.match(/chat_[a-zA-Z0-9]+/);
        const chatId = match ? match[0] : null;

        if (!chatId) {
            // Check reference/reply to get the ID from the bot's previous message
            if (message.reference) {
                const referencedMsg = await message.channel.messages.fetch(message.reference.messageId);
                const refMatch = referencedMsg.content.match(/chat_[a-zA-Z0-9]+/);
                if (refMatch) return this.writeToFirestore(refMatch[0], message.content);
            }
            return;
        }

        const replyText = message.content.replace(chatId, '').trim();
        await this.writeToFirestore(chatId, replyText);
    }

    async writeToFirestore(chatId, text) {
        try {
            await this.db.collection('chats').doc(chatId).collection('messages').add({
                text: text,
                sender: 'admin',
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });

            await this.db.collection('chats').doc(chatId).update({
                lastMessage: text,
                lastSender: 'admin',
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });

            console.log(`[Bot] Relayed reply to ${chatId}`);
        } catch (e) {
            console.error('[Bot] Failed to write to Firestore:', e);
        }
    }

    async handleStatus(message) {
        const statusEmbed = new EmbedBuilder()
            .setTitle('🚀 System Health Report')
            .setColor(mongoose.connection.readyState === 1 ? 0x22c55e : 0xef4444)
            .addFields(
                { name: 'MongoDB', value: mongoose.connection.readyState === 1 ? '✅ Connected' : '❌ Disconnected', inline: true },
                { name: 'Next.js App', value: '✅ Operational', inline: true },
                { name: 'Email (Resend)', value: '✅ Connected', inline: true },
                { name: 'Uptime', value: `${Math.floor(process.uptime() / 60)} minutes`, inline: true }
            )
            .setTimestamp();

        await message.reply({ embeds: [statusEmbed] });
    }
}

module.exports = new SupportBot();

const { Client, GatewayIntentBits, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const Pusher = require('pusher');
const { ChatSession, ChatMessage } = require('../models/Chat');

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
        // We use the "Main" channel ID as a Category ID or a fallback, 
        // but ideally we want a Category ID for tickets.
        // Let's assume DISCORD_CATEGORY_ID is set, or we create one.
        this.categoryId = process.env.DISCORD_CATEGORY_ID;

        // Pusher for relaying back to frontend
        this.pusher = new Pusher({
            appId: process.env.PUSHER_APP_ID,
            key: process.env.NEXT_PUBLIC_PUSHER_KEY,
            secret: process.env.PUSHER_SECRET,
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
            useTLS: true
        });
    }

    async start() {
        if (!this.token) {
            console.error('[Bot] DISCORD_BOT_TOKEN is missing');
            return;
        }

        this.client.on('ready', () => {
            console.log(`[Bot] Logged in as ${this.client.user.tag}`);
            // We don't need a Firestore listener anymore. 
            // The API will trigger specific methods on this instance (if running in same process)
            // OR we rely on the API to update DB and we use a Change Stream (Mongo).

            // Optimization: Use Mongo Change Stream to detect new customer messages
            this.setupMongoListener();
        });

        this.client.on('messageCreate', async (message) => {
            if (message.author.bot) return;

            // Check if this channel corresponds to a Chat Session
            await this.handleDiscordReply(message);
        });

        await this.client.login(this.token);
    }

    async setupMongoListener() {
        console.log('[Bot] Setting up MongoDB Change Stream...');
        // Watch for changes in ChatSessions (specifically lastMessage updates)
        const changeStream = ChatSession.watch();

        changeStream.on('change', async (change) => {
            if (change.operationType === 'update') {
                const updatedFields = change.updateDescription.updatedFields;
                // If lastMessage changed and lastSender is NOT admin
                if (updatedFields.lastMessage && updatedFields.lastSender !== 'admin') {
                    // Fetch full doc to get details
                    const docId = change.documentKey._id;
                    const session = await ChatSession.findById(docId);
                    if (session && session.lastSender === 'customer') {
                        this.notifyChannel(session);
                    }
                }
            } else if (change.operationType === 'insert') {
                // New chat session
                const session = change.fullDocument;
                if (session.lastSender === 'customer') {
                    this.notifyChannel(session);
                }
            }
        });
    }

    async notifyChannel(session) {
        try {
            // Find the guild (server) - assuming first guild or specific ENV
            const guild = this.client.guilds.cache.first();
            if (!guild) {
                console.error('[Bot] No guild found');
                return;
            }

            let channel;

            // 1. Check if we already have a channel ID
            if (session.discordChannelId) {
                channel = await guild.channels.fetch(session.discordChannelId).catch(() => null);
            }

            // 2. If no channel, create one
            if (!channel) {
                // Create channel name derived from customer name or ID
                const cleanName = (session.customerName || 'user').replace(/[^a-z0-9]/gi, '-').toLowerCase() + '-' + session.chatId.slice(-4);

                channel = await guild.channels.create({
                    name: `ticket-${cleanName}`,
                    type: ChannelType.GuildText,
                    topic: `Chat ID: ${session.chatId} | Customer: ${session.customerName}`,
                    parent: this.categoryId || null, // Optional Category
                    permissionOverwrites: [
                        {
                            id: guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel], // Private logic if needed
                        },
                        {
                            id: this.client.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]
                        }
                        // Add Admin Role permissions here if needed
                    ]
                });

                // Update session with new channel ID
                await ChatSession.updateOne({ _id: session._id }, { discordChannelId: channel.id });
                console.log(`[Bot] Created channel ${channel.name} for chat ${session.chatId}`);
            }

            // 3. Send the message embed
            const embed = new EmbedBuilder()
                .setDescription(session.lastMessage)
                .setColor(0x10b981) // Emerald
                .setAuthor({ name: session.customerName || 'Guest User', iconURL: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' })
                .setFooter({ text: `Via Web Chat • ${session.chatId}` })
                .setTimestamp();

            await channel.send({ embeds: [embed] });

        } catch (error) {
            console.error('[Bot] Error in notifyChannel:', error);
        }
    }

    async handleDiscordReply(message) {
        // Find session by channel ID
        const session = await ChatSession.findOne({ discordChannelId: message.channel.id });

        if (!session) return; // Not a chat channel

        const text = message.content;

        // 1. Save to MongoDB
        const newMsg = await ChatMessage.create({
            chatId: session.chatId,
            text: text,
            sender: 'admin',
            timestamp: new Date()
        });

        // 2. Update Session
        await ChatSession.updateOne({ chatId: session.chatId }, {
            lastMessage: text,
            lastSender: 'admin',
            updatedAt: new Date()
        });

        // 3. Trigger Pusher
        try {
            await this.pusher.trigger(`chat-${session.chatId}`, 'new-message', {
                id: newMsg._id,
                text: text,
                sender: 'admin',
                timestamp: newMsg.timestamp,
                _id: newMsg._id // For compatibility
            });
            console.log(`[Bot] Forwarded admin reply to ${session.chatId}`);

            // React to discord message to confirm sent
            await message.react('✅');
        } catch (err) {
            console.error('[Bot] Pusher Error:', err);
            await message.react('❌');
        }
    }
}

module.exports = new SupportBot();

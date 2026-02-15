const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const { createClient } = require('@supabase/supabase-js');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const path = require('path');

// Supabase Init
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

class WhatsAppBot {
    constructor() {
        this.sock = null;
        this.logger = pino({ level: 'info' });
        this.tenantId = process.env.XERA_TENANT_ID; // Current business tenant
    }

    async start() {
        const { state, saveCreds } = await useMultiFileAuthState(path.join(__dirname, '../auth_info_baileys'));

        this.sock = makeWASocket({
            auth: state,
            printQRInTerminal: true,
            logger: this.logger
        });

        this.sock.ev.on('creds.update', saveCreds);

        this.sock.ev.on('connection.update', (update) => {
            const { connection, lastDisconnect, qr } = update;
            if (qr) {
                qrcode.generate(qr, { small: true });
                console.log('Scan the QR code above to connect to WhatsApp');
            }
            if (connection === 'close') {
                const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                console.log('Connection closed due to ', lastDisconnect.error, ', reconnecting ', shouldReconnect);
                if (shouldReconnect) this.start();
            } else if (connection === 'open') {
                console.log('XERA WhatsApp Bot: Connection opened successfully');
            }
        });

        this.sock.ev.on('messages.upsert', async ({ messages, type }) => {
            if (type === 'notify') {
                for (const msg of messages) {
                    if (!msg.key.fromMe && msg.message) {
                        await this.handleMessage(msg);
                    }
                }
            }
        });
    }

    async handleMessage(msg) {
        const from = msg.key.remoteJid;
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;

        if (!text) return;

        console.log(`[WhatsApp] Received message from ${from}: ${text}`);

        // Phase 2: The "Traffic Cop" Logic
        // 1. Check/Create Conversation in Supabase
        const { data: conversation, error } = await supabase
            .from('conversations')
            .select('*')
            .eq('wa_customer_id', from)
            .eq('tenant_id', this.tenantId)
            .single();

        let currentStatus = 'AI_Active';
        let conversationId = null;

        if (error && error.code === 'PGRST116') {
            // New Conversation
            const { data: newConv } = await supabase
                .from('conversations')
                .insert([{
                    wa_customer_id: from,
                    tenant_id: this.tenantId,
                    status: 'AI_Active',
                    metadata: { pushName: msg.pushName }
                }])
                .select()
                .single();
            conversationId = newConv.id;
        } else if (conversation) {
            currentStatus = conversation.status;
            conversationId = conversation.id;
        }

        // 2. Log Message to Supabase
        await supabase.from('messages').insert([{
            conversation_id: conversationId,
            tenant_id: this.tenantId,
            sender_type: 'Customer',
            content: text
        }]);

        // 3. Routing Decision
        if (currentStatus === 'Human_Active') {
            console.log(`[XERA] Human Agent is active for ${from}. AI is staying silent.`);
            // Message is already logged, Shared Inbox (Next.js) will pick it up via Realtime
            return;
        }

        if (currentStatus === 'Needs_Human') {
            console.log(`[XERA] Conversation for ${from} is pending claim. Skipping AI.`);
            return;
        }

        // 4. Default: AI Reply
        await this.generateAIReply(from, text, conversationId);
    }

    async generateAIReply(from, text, conversationId) {
        console.log(`[XERA] Generating AI reply for ${from}...`);

        // Placeholder for Llama 3.1 / Groq logic
        // In a real implementation, we would query the Knowledge Base and detect handoff triggers
        const aiReply = "Hello! I am the XERA AI assistant. A human agent will be with you shortly if needed.";

        // Send reply
        await this.sock.sendMessage(from, { text: aiReply });

        // Log AI message to DB
        await supabase.from('messages').insert([{
            conversation_id: conversationId,
            tenant_id: this.tenantId,
            sender_type: 'AI',
            content: aiReply
        }]);
    }
}

module.exports = new WhatsAppBot();

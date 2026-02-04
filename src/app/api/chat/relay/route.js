import { NextResponse } from 'next/server';

const DISCORD_WEBHOOK_URL = process.env.DISCORD_CHAT_WEBHOOK_URL || process.env.DISCORD_WEBHOOK_URL;

export async function POST(req) {
    try {
        const { chatId, text, customerName = 'Guest User' } = await req.json();

        console.log('--- Discord Relay Attempt ---');
        console.log('Chat ID:', chatId);
        console.log('Text length:', text?.length);
        console.log('Webhook configured:', !!DISCORD_WEBHOOK_URL);

        if (!chatId || !text) {
            return NextResponse.json({ success: false, error: 'Missing chatId or text' }, { status: 400 });
        }

        if (!DISCORD_WEBHOOK_URL) {
            console.warn('Discord Relay: DISCORD_WEBHOOK_URL not configured in environment.');
            return NextResponse.json({ success: true, message: 'Webhook not configured' });
        }

        const embed = {
            title: '💬 New Live Chat Message',
            description: text,
            color: 0x10b981, // Emerald green
            fields: [
                { name: 'Customer', value: customerName, inline: true },
                { name: 'Chat ID', value: chatId, inline: true },
                { name: 'Action', value: `Reply to this message on Discord to send it back to the customer.`, inline: false }
            ],
            footer: { text: 'Live Support Relay' },
            timestamp: new Date().toISOString()
        };

        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: `**Chat Session:** \`${chatId}\``,
                embeds: [embed]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Discord Webhook Failed:', response.status, errorText);
            return NextResponse.json({ success: false, error: 'Discord webhook failed' }, { status: response.status });
        }

        console.log('Discord Relay Success');
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Relay Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

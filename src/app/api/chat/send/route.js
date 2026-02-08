import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { ChatMessage, ChatSession } from '@/models/Chat';
import { pusher } from '@/lib/pusher';

export async function POST(req) {
    try {
        await dbConnect();
        const { chatId, text, sender, customerName } = await req.json();

        if (!chatId || !text || !sender) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Save Message to MongoDB
        const newMessage = await ChatMessage.create({
            chatId,
            text,
            sender,
            timestamp: new Date()
        });

        // 2. Update/Create Chat Session
        const sessionUpdate = {
            lastMessage: text,
            lastSender: sender,
            updatedAt: new Date(),
            status: 'active'
        };
        if (customerName) sessionUpdate.customerName = customerName;

        await ChatSession.findOneAndUpdate(
            { chatId },
            sessionUpdate,
            { upsert: true, new: true }
        );

        // 3. Trigger Pusher Event
        const messageData = {
            id: newMessage._id,
            chatId,
            text,
            sender,
            customerName: customerName || 'Guest User',
            timestamp: newMessage.timestamp
        };

        try {
            await pusher.trigger(`chat-${chatId}`, 'new-message', messageData);
            await pusher.trigger('admin-chats', 'session-update', messageData);
        } catch (pusherError) {
            console.error('Pusher Trigger Error:', pusherError);
        }

        // 4. Relay to Discord and Create Internal Notification
        if (sender === 'customer') {
            try {
                // Internal Notification
                const Notification = (await import('@/models/Notification')).default;
                await Notification.create({
                    type: 'chat',
                    title: 'New Chat Message',
                    message: `Message from ${customerName || 'Guest'}: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`,
                    link: '/admin?view=chat'
                });

                // Internal fetch to our relay route
                const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
                const host = req.headers.get('host');
                fetch(`${protocol}://${host}/api/chat/relay`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ chatId, text, customerName })
                }).catch(e => console.error('Discord Relay Fetch Error:', e));
            } catch (relayError) {
                console.error('Discord Relay/Notification Error:', relayError);
            }
        }

        return NextResponse.json({ success: true, message: newMessage });
    } catch (error) {
        console.error('Chat Send Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { ChatMessage } from '@/models/Chat';

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const chatId = searchParams.get('chatId');

        if (!chatId) {
            return NextResponse.json({ success: false, error: 'Missing chatId' }, { status: 400 });
        }

        const messages = await ChatMessage.find({ chatId })
            .sort({ timestamp: 1 })
            .limit(100);

        return NextResponse.json({ success: true, messages });
    } catch (error) {
        console.error('Chat History Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

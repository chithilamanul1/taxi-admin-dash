import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { ChatSession } from '@/models/Chat';

export async function GET() {
    try {
        await dbConnect();

        const sessions = await ChatSession.find()
            .sort({ updatedAt: -1 })
            .limit(50);

        return NextResponse.json({ success: true, sessions });
    } catch (error) {
        console.error('Chat Sessions Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

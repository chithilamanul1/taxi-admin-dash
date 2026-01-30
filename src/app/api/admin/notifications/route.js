import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Notification from '../../../../models/Notification';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

export async function GET(req) {
    try {
        await dbConnect();

        // Simple auth check (expand if needed)
        // const session = await getServerSession(authOptions);
        // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const notifications = await Notification.find({})
            .sort({ createdAt: -1 })
            .limit(50);

        const unreadCount = await Notification.countDocuments({ isRead: false });

        return NextResponse.json({ success: true, data: notifications, unreadCount });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch notifications' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        await dbConnect();
        const { id, markAllRead } = await req.json();

        if (markAllRead) {
            await Notification.updateMany({ isRead: false }, { isRead: true });
            return NextResponse.json({ success: true });
        }

        if (id) {
            await Notification.findByIdAndUpdate(id, { isRead: true });
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();

        const notification = await Notification.create({
            type: body.type || 'system',
            title: body.title,
            message: body.message,
            link: body.link
        });

        return NextResponse.json({ success: true, data: notification });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Creation failed' }, { status: 500 });
    }
}

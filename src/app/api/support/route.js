import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Ticket from '../../../models/Ticket';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { sendOwnerNotification } from '@/lib/email-service';

// GET: List tickets
export async function GET(req) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        let tickets;
        if (session.user.role === 'admin') {
            // Admin sees all tickets, sorted by newest
            tickets = await Ticket.find({}).populate('user', 'name email').sort({ lastUpdated: -1 });
        } else {
            // User sees their own tickets
            tickets = await Ticket.find({ user: session.user.id }).sort({ lastUpdated: -1 });
        }

        return NextResponse.json({ success: true, data: tickets });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST: Create new ticket
export async function POST(req) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { subject, message, priority } = await req.json();

        if (!subject || !message) {
            return NextResponse.json({ success: false, error: 'Subject and message are required' }, { status: 400 });
        }

        const ticket = await Ticket.create({
            user: session.user.id,
            subject,
            priority: priority || 'medium',
            status: 'open',
            messages: [{
                sender: 'user',
                message,
                timestamp: new Date()
            }]
        });

        // Notify Owner
        await sendOwnerNotification('New Support Ticket', {
            Subject: subject,
            Priority: priority || 'medium',
            User: session.user.name || session.user.email,
            Message: message.substring(0, 200) + (message.length > 200 ? '...' : '')
        }).catch(console.error);

        return NextResponse.json({ success: true, data: ticket });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

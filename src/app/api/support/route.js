import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Ticket from '../../../models/Ticket';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { sendEmail } from '@/lib/email';

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

        // Log to Discord
        const { logTicketCreated } = await import('@/lib/discord');
        await logTicketCreated(ticket).catch(console.error);

        // Optional: Notify Admins via Email
        // await sendEmail({ to: 'admin@srilankantaxi.lk', subject: 'New Support Ticket', html: ... })

        return NextResponse.json({ success: true, data: ticket });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

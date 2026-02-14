import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Ticket from '@/models/Ticket';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: List tickets
export async function GET(req) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const isAdmin = session.user.role === 'admin' || session.user.email === process.env.ADMIN_EMAIL;

        let tickets;
        if (isAdmin) {
            tickets = await Ticket.find({}).sort({ lastUpdated: -1 }).populate('user', 'name email');
        } else {
            tickets = await Ticket.find({ user: session.user.id }).sort({ lastUpdated: -1 });
        }

        return NextResponse.json({ success: true, tickets, isAdmin });

    } catch (error) {
        console.error("Fetch Tickets Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST: Create new ticket
export async function POST(req) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();

        const ticket = await Ticket.create({
            user: session.user.id,
            subject: data.subject,
            messages: [{
                sender: 'user',
                message: data.message
            }],
            status: 'open',
            lastUpdated: new Date()
        });

        return NextResponse.json({ success: true, ticket });

    } catch (error) {
        console.error("Create Ticket Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Ticket from '@/models/Ticket';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(req, { params }) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const { message } = await req.json();

        const ticket = await Ticket.findById(id);
        if (!ticket) return NextResponse.json({ success: false, message: 'Ticket not found' }, { status: 404 });

        const isAdmin = session.user.role === 'admin' || session.user.email === process.env.ADMIN_EMAIL;

        // Security check: Only owner or admin can reply
        if (!isAdmin && ticket.user?.toString() !== session.user.id) {
            return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
        }

        const sender = isAdmin ? 'admin' : 'user';

        // Push message
        ticket.messages.push({
            sender,
            message
        });

        // Update status logic
        if (sender === 'admin') {
            ticket.status = 'answered'; // Waiting for user
        } else {
            ticket.status = 'open'; // Waiting for admin
        }

        ticket.lastUpdated = new Date();
        await ticket.save();

        return NextResponse.json({ success: true, ticket });

    } catch (error) {
        console.error("Reply Ticket Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

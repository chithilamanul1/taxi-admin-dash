import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SupportTicket from '@/models/SupportTicket';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req, { params }) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

        const { id } = params;
        const { message } = await req.json();

        const ticket = await SupportTicket.findById(id);
        if (!ticket) return NextResponse.json({ success: false, message: 'Ticket not found' }, { status: 404 });

        const isAdmin = session.user.role === 'admin' || session.user.email === process.env.ADMIN_EMAIL;

        // Security check: Only owner or admin can reply
        if (!isAdmin && ticket.customer.toString() !== session.user.id) {
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
            ticket.status = 'pending_user'; // Waiting for user
        } else {
            ticket.status = 'open'; // Waiting for admin
        }

        await ticket.save();

        return NextResponse.json({ success: true, ticket });

    } catch (error) {
        console.error("Reply Ticket Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

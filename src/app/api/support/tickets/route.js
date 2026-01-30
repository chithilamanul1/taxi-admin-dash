import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import SupportTicket from '@/models/SupportTicket';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        // For now, require login. We can expand to guests later.
        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();

        const ticket = await SupportTicket.create({
            customer: session.user.id,
            subject: data.subject,
            messages: [{
                sender: 'user',
                message: data.message // Initial message
            }],
            status: 'open'
        });

        return NextResponse.json({ success: true, ticket });

    } catch (error) {
        console.error("Create Ticket Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        // Check if Admin (Assuming admin role logic exists, or hardcoded emails)
        // For simple check:
        const isAdmin = session.user.role === 'admin' || session.user.email === process.env.ADMIN_EMAIL;

        let tickets;
        if (isAdmin) {
            // Admin sees all tickets
            tickets = await SupportTicket.find({}).sort({ updatedAt: -1 }).populate('customer', 'name email');
        } else {
            // User sees only their tickets
            tickets = await SupportTicket.find({ customer: session.user.id }).sort({ updatedAt: -1 });
        }

        return NextResponse.json({ success: true, tickets, isAdmin });

    } catch (error) {
        console.error("Fetch Tickets Error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

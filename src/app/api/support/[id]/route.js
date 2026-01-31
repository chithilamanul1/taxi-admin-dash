import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Ticket from '../../../../models/Ticket';
import User from '../../../../models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { sendEmail } from '@/lib/email';

// GET: Get single ticket details
export async function GET(req, { params }) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const ticket = await Ticket.findById(params.id).populate('user', 'name email');

        if (!ticket) return NextResponse.json({ success: false, error: 'Ticket not found' }, { status: 404 });

        // Access Control
        if (session.user.role !== 'admin' && ticket.user._id.toString() !== session.user.id) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        return NextResponse.json({ success: true, data: ticket });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// PUT: Reply to ticket or update status
export async function PUT(req, { params }) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

        const { message, status } = await req.json();
        const ticket = await Ticket.findById(params.id).populate('user', 'email name');

        if (!ticket) return NextResponse.json({ success: false, error: 'Ticket not found' }, { status: 404 });

        // Access Control
        const isAdmin = session.user.role === 'admin';
        if (!isAdmin && ticket.user._id.toString() !== session.user.id) {
            return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
        }

        // Update logic
        if (message) {
            const sender = isAdmin ? 'admin' : 'user';

            ticket.messages.push({
                sender: sender,
                message: message,
                timestamp: new Date()
            });
            ticket.lastUpdated = new Date();

            // Auto-status update
            if (isAdmin && ticket.status === 'open') ticket.status = 'answered';
            if (!isAdmin) ticket.status = 'open'; // Re-open if user replies

            // Email Notification
            const recipient = isAdmin ? ticket.user.email : 'admin@srilankantaxi.lk'; // Simplified admin email
            const subject = `New Reply on Ticket #${ticket._id.toString().slice(-6)}`;

            if (isAdmin) {
                await sendEmail({
                    to: ticket.user.email,
                    subject: `Support Reply: ${ticket.subject}`,
                    html: `<p>Hi ${ticket.user.name},</p><p>You have a new reply on your support ticket:</p><blockquote>${message}</blockquote><p>Click here to view: <a href="${process.env.NEXTAUTH_URL}/support">View Ticket</a></p>`
                });
            }
        }

        if (status && isAdmin) {
            ticket.status = status;
        }

        await ticket.save();

        return NextResponse.json({ success: true, data: ticket });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

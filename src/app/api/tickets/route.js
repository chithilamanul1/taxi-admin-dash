import dbConnect from '@/lib/db';
import Ticket from '@/models/Ticket';
import { NextResponse } from 'next/server';

import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

async function isAdmin() {
    const session = await getServerSession(authOptions);
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (session?.user?.role === 'admin') return true;

    if (token) {
        try {
            const { verify } = await import('jsonwebtoken');
            const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
            const decoded = verify(token, secret);
            if (decoded.role === 'admin') return true;
        } catch (e) { }
    }
    return false;
}

export async function GET() {
    await dbConnect();
    if (!(await isAdmin())) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const tickets = await Ticket.find().populate('user', 'name email').sort({ lastUpdated: -1 });
        return NextResponse.json(tickets);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    // Public endpoint for ticket creation (Customers need to report issues)
    // We can add Captcha or Rate Limit later
    await dbConnect();
    try {
        const body = await req.json();
        const ticket = await Ticket.create(body);
        return NextResponse.json(ticket);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

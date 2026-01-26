import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { sendEmail } from '@/lib/email';
import { cookies } from 'next/headers';

export async function POST(req) {
    try {
        await dbConnect();

        // Check NextAuth session first
        const session = await getServerSession(authOptions);

        // Also check for admin cookie (separate admin login)
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;

        let isCustomAdmin = false;
        if (token) {
            try {
                const { verify } = await import('jsonwebtoken');
                const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
                const decoded = verify(token, secret);
                if (decoded.role === 'admin') isCustomAdmin = true;
            } catch (e) {
                console.error('Token verification failed:', e.message);
            }
        }

        // Allow if either: admin role in session OR has valid admin token
        const isAdmin = (session?.user?.role === 'admin') || isCustomAdmin;

        if (!isAdmin) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { recipientType, customEmail, subject, message } = await req.json();
        // recipientType: 'all_users', 'all_drivers', 'specific'

        let recipients = [];

        if (recipientType === 'specific') {
            if (!customEmail) return NextResponse.json({ success: false, error: 'Email required' }, { status: 400 });
            recipients = [customEmail];
        } else if (recipientType === 'all_users') {
            const users = await User.find({ role: 'user' }).select('email');
            recipients = users.map(u => u.email);
        } else if (recipientType === 'all_drivers') {
            const drivers = await User.find({ role: 'driver' }).select('email');
            recipients = drivers.map(u => u.email);
        }

        // Send in batches to avoid rate limits (basic implementation)
        // For production, use a queue like Redis/Bull, but loop is fine for small scale
        let successCount = 0;
        let failCount = 0;

        // Construct HTML wrapper
        const htmlContent = `
            <div style="font-family: sans-serif; padding: 20px;">
                ${message.replace(/\n/g, '<br/>')}
                <hr style="margin: 20px 0; border: 0; border-top: 1px solid #eee;"/>
                <p style="font-size: 12px; color: #888;">Sent by Admin - Airport Taxi Tours</p>
            </div>
        `;

        for (const email of recipients) {
            const res = await sendEmail({
                to: email,
                subject: subject,
                html: htmlContent
            });
            if (res.success) successCount++;
            else failCount++;
        }

        return NextResponse.json({ success: true, sent: successCount, failed: failCount });

    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

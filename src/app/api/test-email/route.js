import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET(req) {
    try {
        const apiKey = process.env.RESEND_API_KEY;
        const fromEmail = process.env.FROM_EMAIL || 'Airport Taxis <noreply@airporttaxi.lk>';
        // Allow overriding 'to' email via query param, default to a safe test email or the owner email for safety
        const { searchParams } = new URL(req.url);
        const toEmail = searchParams.get('to') || 'info@airporttaxi.lk';

        if (!apiKey) {
            return NextResponse.json({ error: 'Missing RESEND_API_KEY env var' }, { status: 500 });
        }

        const resend = new Resend(apiKey);

        const data = await resend.emails.send({
            from: fromEmail,
            to: toEmail,
            subject: 'Test Email from Airport Transfers',
            html: '<p>This is a test email to verify the Resend configuration.</p>'
        });

        if (data.error) {
            return NextResponse.json({ success: false, error: data.error }, { status: 400 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 });
    }
}

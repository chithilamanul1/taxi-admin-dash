import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialized lazily inside handler

// Send booking confirmation email
export async function POST(req) {
    try {
        const { to, bookingDetails } = await req.json();

        if (!to || !bookingDetails) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!process.env.RESEND_API_KEY) {
            console.error('RESEND_API_KEY missing');
            return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
        }
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from: 'Airport Taxi Tours <bookings@airporttaxitours.lk>',
            to: [to],
            subject: `Booking Confirmed - #${bookingDetails.bookingId?.slice(-8).toUpperCase()}`,
            html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc;">
                    <div style="background: linear-gradient(135deg, #064e3b 0%, #065f46 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 28px;">✈️ Airport Taxi Tours</h1>
                        <p style="color: #a7f3d0; margin: 10px 0 0 0; font-size: 14px;">Your Trusted Transfer Partner</p>
                    </div>
                    
                    <div style="padding: 40px 30px; background: white;">
                        <div style="text-align: center; margin-bottom: 30px;">
                            <div style="display: inline-block; background: #d1fae5; border-radius: 50%; padding: 20px; margin-bottom: 15px;">
                                <span style="font-size: 32px;">✓</span>
                            </div>
                            <h2 style="color: #064e3b; margin: 0; font-size: 24px;">Booking Confirmed!</h2>
                            <p style="color: #6b7280; margin: 10px 0 0 0;">Reference: <strong>#${bookingDetails.bookingId?.slice(-8).toUpperCase()}</strong></p>
                        </div>
                        
                        <div style="background: #f1f5f9; border-radius: 16px; padding: 25px; margin-bottom: 25px;">
                            <h3 style="color: #064e3b; margin: 0 0 15px 0; font-size: 16px; text-transform: uppercase; letter-spacing: 1px;">Trip Details</h3>
                            
                            <div style="margin-bottom: 12px;">
                                <span style="color: #6b7280; font-size: 12px; text-transform: uppercase;">Pickup</span>
                                <p style="margin: 5px 0 0 0; color: #1e293b; font-weight: 600;">${bookingDetails.pickup || 'N/A'}</p>
                            </div>
                            
                            <div style="margin-bottom: 12px;">
                                <span style="color: #6b7280; font-size: 12px; text-transform: uppercase;">Dropoff</span>
                                <p style="margin: 5px 0 0 0; color: #1e293b; font-weight: 600;">${bookingDetails.dropoff || 'N/A'}</p>
                            </div>
                            
                            <div style="display: flex; gap: 20px; margin-top: 15px;">
                                <div>
                                    <span style="color: #6b7280; font-size: 12px; text-transform: uppercase;">Date</span>
                                    <p style="margin: 5px 0 0 0; color: #1e293b; font-weight: 600;">${bookingDetails.date || 'N/A'}</p>
                                </div>
                                <div>
                                    <span style="color: #6b7280; font-size: 12px; text-transform: uppercase;">Time</span>
                                    <p style="margin: 5px 0 0 0; color: #1e293b; font-weight: 600;">${bookingDetails.time || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div style="background: #064e3b; border-radius: 16px; padding: 25px; text-align: center; color: white;">
                            <span style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7;">Total Amount</span>
                            <p style="font-size: 36px; font-weight: 800; margin: 10px 0 0 0;">Rs ${bookingDetails.totalPrice?.toLocaleString() || '0'}</p>
                        </div>
                    </div>
                    
                    <div style="padding: 30px; text-align: center; background: #f1f5f9;">
                        <p style="color: #6b7280; font-size: 14px; margin: 0;">Questions? Contact us at</p>
                        <p style="color: #064e3b; font-weight: 600; margin: 5px 0 0 0;">+94 71 688 5880</p>
                    </div>
                </div>
            `
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
        }

        return NextResponse.json({ success: true, messageId: data?.id });

    } catch (error) {
        console.error('Email notification error:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}

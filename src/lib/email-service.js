// Email Notification Service
// Handles all customer and admin email notifications

import { Resend } from 'resend';

const getResend = () => {
    if (!process.env.RESEND_API_KEY) {
        console.warn('[Email] RESEND_API_KEY is missing');
        return null;
    }
    return new Resend(process.env.RESEND_API_KEY);
};

const OWNER_EMAIL = process.env.OWNER_EMAIL || 'airporttaxis.lk@gmail.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'Airport Taxis <noreply@airporttaxis.lk>';

// Base Email Template
const getBaseTemplate = (content, title = 'Airport Taxis Sri Lanka') => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #064e3b 0%, #065f46 100%); padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800;">🚕 AIRPORT TAXIS</h1>
                            <p style="color: #6ee7b7; margin: 8px 0 0; font-size: 14px; letter-spacing: 2px;">SRI LANKA (PVT) LTD</p>
                        </td>
                    </tr>
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            ${content}
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; text-align: center;">
                                📍 118/5 St. Joseph Street, Grandpass, Colombo 14
                            </p>
                            <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; text-align: center;">
                                📞 +94 722 885 885 | ✉️ airporttaxis.lk@gmail.com
                            </p>
                            <p style="margin: 15px 0 0; color: #9ca3af; font-size: 12px; text-align: center;">
                                © ${new Date().getFullYear()} Airport Taxis (Pvt) Ltd. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

// Send email to customer when they log in
export async function sendLoginNotification(user) {
    const content = `
        <h2 style="color: #064e3b; margin: 0 0 20px;">Welcome Back! 👋</h2>
        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            Hi <strong>${user.name || 'Valued Customer'}</strong>,
        </p>
        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            You've successfully logged into your Airport Taxis account.
        </p>
        <table width="100%" style="background-color: #f0fdf4; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <tr>
                <td>
                    <p style="margin: 0; color: #166534;"><strong>📧 Email:</strong> ${user.email}</p>
                    <p style="margin: 10px 0 0; color: #166534;"><strong>🕐 Time:</strong> ${new Date().toLocaleString('en-LK', { timeZone: 'Asia/Colombo' })}</p>
                </td>
            </tr>
        </table>
        <p style="color: #6b7280; font-size: 14px;">
            If this wasn't you, please contact us immediately.
        </p>
        <div style="text-align: center; margin-top: 30px;">
            <a href="https://airporttaxis.lk" style="display: inline-block; background-color: #064e3b; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Book a Ride</a>
        </div>
    `;

    try {
        const resend = getResend();
        if (!resend) return;

        await resend.emails.send({
            from: FROM_EMAIL,
            to: user.email,
            subject: '🔐 Login Notification - Airport Taxis Sri Lanka',
            html: getBaseTemplate(content, 'Login Notification')
        });
        console.log('[Email] Login notification sent to:', user.email);
    } catch (error) {
        console.error('[Email] Failed to send login notification:', error);
    }
}

// Send booking confirmation to customer AND owner
export async function sendBookingConfirmation(booking) {
    const pickupShort = booking.pickupLocation?.address?.split(',')[0] || 'Pickup';
    const dropoffShort = booking.dropoffLocation?.address?.split(',')[0] || 'Dropoff';

    const customerContent = `
        <h2 style="color: #064e3b; margin: 0 0 20px;">Booking Confirmed! ✅</h2>
        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            Dear <strong>${booking.customerName || 'Valued Customer'}</strong>,
        </p>
        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            Thank you for booking with Airport Taxis! Here are your booking details:
        </p>
        
        <table width="100%" style="background-color: #f0fdf4; border-radius: 12px; margin: 20px 0; border-collapse: collapse;">
            <tr>
                <td style="padding: 20px; border-bottom: 1px solid #dcfce7;">
                    <p style="margin: 0 0 5px; color: #6b7280; font-size: 12px; text-transform: uppercase;">Booking ID</p>
                    <p style="margin: 0; color: #064e3b; font-size: 18px; font-weight: bold;">#${booking._id?.toString().slice(-8).toUpperCase()}</p>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px; border-bottom: 1px solid #dcfce7;">
                    <p style="margin: 0 0 5px; color: #6b7280; font-size: 12px; text-transform: uppercase;">Route</p>
                    <p style="margin: 0; color: #064e3b; font-size: 16px;">
                        📍 ${pickupShort} → ${dropoffShort}
                    </p>
                    <p style="margin: 5px 0 0; color: #6b7280; font-size: 14px;">${booking.distance || 0} km</p>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px; border-bottom: 1px solid #dcfce7;">
                    <p style="margin: 0 0 5px; color: #6b7280; font-size: 12px; text-transform: uppercase;">Date & Time</p>
                    <p style="margin: 0; color: #064e3b; font-size: 16px;">
                        📅 ${booking.scheduledDate || 'Immediate'} ${booking.scheduledTime ? `at ${booking.scheduledTime}` : ''}
                    </p>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px; border-bottom: 1px solid #dcfce7;">
                    <p style="margin: 0 0 5px; color: #6b7280; font-size: 12px; text-transform: uppercase;">Vehicle</p>
                    <p style="margin: 0; color: #064e3b; font-size: 16px;">🚗 ${booking.vehicleType || 'Standard'}</p>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px;">
                    <p style="margin: 0 0 5px; color: #6b7280; font-size: 12px; text-transform: uppercase;">Total Amount</p>
                    <p style="margin: 0; color: #064e3b; font-size: 24px; font-weight: bold;">LKR ${booking.totalPrice?.toLocaleString() || 0}</p>
                    <p style="margin: 5px 0 0; color: #6b7280; font-size: 14px;">Payment: ${booking.paymentMethod || 'Cash'}</p>
                </td>
            </tr>
        </table>
        
        ${booking.hasNameBoard ? '<p style="color: #059669; font-size: 14px;">✅ Airport Name Board requested</p>' : ''}
        
        <p style="color: #374151; line-height: 1.6; margin: 20px 0;">
            Our driver will contact you before pickup. For any queries, please call us at <strong>+94 722 885 885</strong>.
        </p>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="https://airporttaxis.lk/my-bookings" style="display: inline-block; background-color: #064e3b; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">View My Bookings</a>
        </div>
    `;

    // Send to customer
    if (booking.customerEmail) {
        try {
            const resend = getResend();
            if (resend) {
                await resend.emails.send({
                    from: FROM_EMAIL,
                    to: booking.customerEmail,
                    subject: `✅ Booking Confirmed #${booking._id?.toString().slice(-8).toUpperCase()} - Airport Taxis`,
                    html: getBaseTemplate(customerContent, 'Booking Confirmation')
                });
                console.log('[Email] Booking confirmation sent to customer:', booking.customerEmail);
            }
        } catch (error) {
            console.error('[Email] Failed to send customer booking confirmation:', error);
        }
    }

    // Send copy to owner
    const ownerContent = `
        <h2 style="color: #064e3b; margin: 0 0 20px;">📢 New Booking Received!</h2>
        
        <table width="100%" style="background-color: #fef3c7; border-radius: 12px; margin: 20px 0; border-collapse: collapse;">
            <tr>
                <td style="padding: 20px;">
                    <p style="margin: 0 0 10px;"><strong>Booking ID:</strong> #${booking._id?.toString().slice(-8).toUpperCase()}</p>
                    <p style="margin: 0 0 10px;"><strong>Customer:</strong> ${booking.customerName || 'Guest'}</p>
                    <p style="margin: 0 0 10px;"><strong>Phone:</strong> ${booking.guestPhone || 'N/A'}</p>
                    <p style="margin: 0 0 10px;"><strong>Email:</strong> ${booking.customerEmail || 'N/A'}</p>
                    <hr style="border: none; border-top: 1px solid #fcd34d; margin: 15px 0;">
                    <p style="margin: 0 0 10px;"><strong>Pickup:</strong> ${booking.pickupLocation?.address || 'N/A'}</p>
                    <p style="margin: 0 0 10px;"><strong>Dropoff:</strong> ${booking.dropoffLocation?.address || 'N/A'}</p>
                    <p style="margin: 0 0 10px;"><strong>Distance:</strong> ${booking.distance || 0} km</p>
                    <p style="margin: 0 0 10px;"><strong>Vehicle:</strong> ${booking.vehicleType || 'Standard'}</p>
                    <hr style="border: none; border-top: 1px solid #fcd34d; margin: 15px 0;">
                    <p style="margin: 0 0 10px;"><strong>Date:</strong> ${booking.scheduledDate || 'Immediate'}</p>
                    <p style="margin: 0 0 10px;"><strong>Time:</strong> ${booking.scheduledTime || 'ASAP'}</p>
                    <p style="margin: 0 0 10px;"><strong>Total:</strong> LKR ${booking.totalPrice?.toLocaleString() || 0}</p>
                    <p style="margin: 0;"><strong>Payment:</strong> ${booking.paymentMethod || 'Cash'}</p>
                </td>
            </tr>
        </table>
        
        <div style="text-align: center; margin-top: 20px;">
            <a href="https://airporttaxis.lk/admin" style="display: inline-block; background-color: #064e3b; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Go to Admin Panel</a>
        </div>
    `;

    try {
        const resend = getResend();
        if (resend) {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: OWNER_EMAIL,
                subject: `🚨 NEW BOOKING #${booking._id?.toString().slice(-8).toUpperCase()} - ${booking.customerName || 'Guest'}`,
                html: getBaseTemplate(ownerContent, 'New Booking Alert')
            });
            console.log('[Email] Booking notification sent to owner');
        }
    } catch (error) {
        console.error('[Email] Failed to send owner booking notification:', error);
    }
}

// Send trip completion notification to customer
export async function sendTripCompletedNotification(booking) {
    const pickupShort = booking.pickupLocation?.address?.split(',')[0] || 'Pickup';
    const dropoffShort = booking.dropoffLocation?.address?.split(',')[0] || 'Dropoff';

    const content = `
        <h2 style="color: #064e3b; margin: 0 0 20px;">Trip Completed! 🎉</h2>
        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            Dear <strong>${booking.customerName || 'Valued Customer'}</strong>,
        </p>
        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            Thank you for travelling with Airport Taxis! We hope you had a pleasant journey.
        </p>
        
        <table width="100%" style="background-color: #f0fdf4; border-radius: 12px; margin: 20px 0; padding: 20px;">
            <tr>
                <td>
                    <p style="margin: 0 0 10px; color: #064e3b;"><strong>Route:</strong> ${pickupShort} → ${dropoffShort}</p>
                    <p style="margin: 0 0 10px; color: #064e3b;"><strong>Distance:</strong> ${booking.distance || 0} km</p>
                    <p style="margin: 0; color: #064e3b;"><strong>Total Paid:</strong> LKR ${booking.totalPrice?.toLocaleString() || 0}</p>
                </td>
            </tr>
        </table>
        
        <div style="background-color: #fef3c7; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="margin: 0 0 15px; color: #92400e; font-size: 16px; font-weight: bold;">
                ⭐ How was your trip?
            </p>
            <p style="margin: 0 0 15px; color: #78350f; font-size: 14px;">
                Your feedback helps us improve! Please take a moment to review your experience.
            </p>
            <a href="https://airporttaxis.lk/review/${booking._id}" style="display: inline-block; background-color: #f59e0b; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Leave a Review</a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 20px;">
            Book your next trip at <a href="https://airporttaxis.lk" style="color: #059669;">airporttaxis.lk</a>
        </p>
    `;

    if (booking.customerEmail) {
        try {
            const resend = getResend();
            if (resend) {
                await resend.emails.send({
                    from: FROM_EMAIL,
                    to: booking.customerEmail,
                    subject: '✅ Trip Completed - Thank You for Travelling with Us!',
                    html: getBaseTemplate(content, 'Trip Completed')
                });
                console.log('[Email] Trip completion notification sent to:', booking.customerEmail);
            }
        } catch (error) {
            console.error('[Email] Failed to send trip completion email:', error);
        }
    }
}

// Send review thank you notification
export async function sendReviewThankYou(review) {
    const content = `
        <h2 style="color: #064e3b; margin: 0 0 20px;">Thank You for Your Review! ⭐</h2>
        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            Dear <strong>${review.userName}</strong>,
        </p>
        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            We truly appreciate you taking the time to share your experience with Airport Taxis!
        </p>
        
        <table width="100%" style="background-color: #fdf4ff; border-radius: 12px; margin: 20px 0; padding: 20px;">
            <tr>
                <td>
                    <p style="margin: 0 0 10px; color: #86198f; font-size: 24px;">${'⭐'.repeat(review.rating)}</p>
                    <p style="margin: 0 0 10px; color: #701a75;"><strong>Route:</strong> ${review.route || 'N/A'}</p>
                    <p style="margin: 0; color: #701a75; font-style: italic;">"${review.comment}"</p>
                </td>
            </tr>
        </table>
        
        <p style="color: #374151; line-height: 1.6;">
            Your review will be visible on our website after approval. It helps other travelers make informed decisions!
        </p>
        
        <div style="text-align: center; margin-top: 30px;">
            <a href="https://airporttaxis.lk" style="display: inline-block; background-color: #064e3b; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Book Another Trip</a>
        </div>
    `;

    if (review.userEmail) {
        try {
            const resend = getResend();
            if (resend) {
                await resend.emails.send({
                    from: FROM_EMAIL,
                    to: review.userEmail,
                    subject: '⭐ Thank You for Your Review - Airport Taxis',
                    html: getBaseTemplate(content, 'Review Thank You')
                });
                console.log('[Email] Review thank you sent to:', review.userEmail);
            }
        } catch (error) {
            console.error('[Email] Failed to send review thank you:', error);
        }
    }
}

// Send payment confirmation to customer
export async function sendPaymentConfirmation(booking) {
    const content = `
        <h2 style="color: #064e3b; margin: 0 0 20px;">Payment Successful! 💳</h2>
        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            Dear <strong>${booking.customerName || 'Valued Customer'}</strong>,
        </p>
        <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
            We've received your payment for your upcoming trip. Here's your payment receipt:
        </p>
        
        <table width="100%" style="background-color: #f0fdf4; border-radius: 12px; margin: 20px 0; border-collapse: collapse;">
            <tr>
                <td style="padding: 20px; border-bottom: 1px solid #dcfce7;">
                    <p style="margin: 0 0 5px; color: #6b7280; font-size: 12px; text-transform: uppercase;">Transaction ID</p>
                    <p style="margin: 0; color: #064e3b; font-size: 16px; font-weight: bold;">${booking.transactionId || booking._id?.toString().slice(-8).toUpperCase()}</p>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px; border-bottom: 1px solid #dcfce7;">
                    <p style="margin: 0 0 5px; color: #6b7280; font-size: 12px; text-transform: uppercase;">Amount Paid</p>
                    <p style="margin: 0; color: #059669; font-size: 28px; font-weight: bold;">LKR ${booking.totalPrice?.toLocaleString() || 0}</p>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px; border-bottom: 1px solid #dcfce7;">
                    <p style="margin: 0 0 5px; color: #6b7280; font-size: 12px; text-transform: uppercase;">Payment Method</p>
                    <p style="margin: 0; color: #064e3b; font-size: 16px;">${booking.paymentMethod === 'card' ? '💳 Card Payment' : '💵 ' + (booking.paymentMethod || 'Online')}</p>
                </td>
            </tr>
            <tr>
                <td style="padding: 20px;">
                    <p style="margin: 0 0 5px; color: #6b7280; font-size: 12px; text-transform: uppercase;">Booking Reference</p>
                    <p style="margin: 0; color: #064e3b; font-size: 16px; font-weight: bold;">#${booking._id?.toString().slice(-8).toUpperCase()}</p>
                </td>
            </tr>
        </table>
        
        <div style="background-color: #ecfdf5; border-radius: 12px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="margin: 0; color: #059669; font-size: 16px;">
                ✅ Your booking is confirmed and our driver will contact you before pickup.
            </p>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 20px;">
            Questions? Contact us at <a href="tel:+94722885885" style="color: #059669;">+94 722 885 885</a>
        </p>
    `;

    if (booking.customerEmail) {
        try {
            const resend = getResend();
            if (resend) {
                await resend.emails.send({
                    from: FROM_EMAIL,
                    to: booking.customerEmail,
                    subject: `💳 Payment Confirmed - LKR ${booking.totalPrice?.toLocaleString()} - Airport Taxis`,
                    html: getBaseTemplate(content, 'Payment Confirmation')
                });
                console.log('[Email] Payment confirmation sent to:', booking.customerEmail);
            }
        } catch (error) {
            console.error('[Email] Failed to send payment confirmation:', error);
        }
    }
}

export default {
    sendLoginNotification,
    sendBookingConfirmation,
    sendPaymentConfirmation,
    sendTripCompletedNotification,
    sendReviewThankYou
};

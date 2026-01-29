// Premium Email Notification Service
// Handles all customer and admin email notifications with stunning designs

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
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://airporttaxis.lk';

// ============================================
// PREMIUM EMAIL TEMPLATE SYSTEM
// Dark Emerald + Gold Luxury Design
// ============================================

const COLORS = {
    primary: '#064e3b',      // Dark Emerald
    primaryLight: '#059669', // Emerald
    gold: '#d4af37',         // Premium Gold
    goldLight: '#f4d47c',    // Light Gold
    dark: '#0f172a',         // Slate 900
    darkCard: '#1e293b',     // Slate 800
    text: '#f8fafc',         // Slate 50
    textMuted: '#94a3b8',    // Slate 400
    success: '#22c55e',      // Green 500
    warning: '#f59e0b',      // Amber 500
    border: '#334155'        // Slate 700
};

// Premium Base Template with Dark Theme
const getPremiumTemplate = (content, title = 'Airport Taxis Sri Lanka') => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="dark">
    <title>${title}</title>
    <!--[if mso]>
    <style type="text/css">
        table { border-collapse: collapse; }
        .button { padding: 14px 30px !important; }
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: ${COLORS.dark}; color: ${COLORS.text};">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.dark}; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.darkCard}; border-radius: 24px; overflow: hidden; border: 1px solid ${COLORS.border};">
                    
                    <!-- Premium Header with Gradient -->
                    <tr>
                        <td style="background: linear-gradient(135deg, ${COLORS.primary} 0%, #047857 50%, ${COLORS.primary} 100%); padding: 40px 30px; text-align: center; position: relative;">
                            <!-- Gold Accent Line -->
                            <div style="width: 60px; height: 3px; background: linear-gradient(90deg, transparent, ${COLORS.gold}, transparent); margin: 0 auto 20px;"></div>
                            
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 2px;">
                                🚕 AIRPORT TAXIS
                            </h1>
                            <p style="color: ${COLORS.goldLight}; margin: 10px 0 0; font-size: 12px; letter-spacing: 4px; text-transform: uppercase;">
                                Sri Lanka's Premium Transfer Service
                            </p>
                            
                            <!-- Gold Accent Line -->
                            <div style="width: 60px; height: 3px; background: linear-gradient(90deg, transparent, ${COLORS.gold}, transparent); margin: 20px auto 0;"></div>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            ${content}
                        </td>
                    </tr>
                    
                    <!-- Premium Footer -->
                    <tr>
                        <td style="background-color: ${COLORS.dark}; padding: 30px; border-top: 1px solid ${COLORS.border};">
                            <!-- Contact Icons -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding-bottom: 20px;">
                                        <table cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding: 0 10px;">
                                                    <a href="tel:+94722885885" style="display: inline-block; width: 40px; height: 40px; background-color: ${COLORS.darkCard}; border-radius: 50%; text-align: center; line-height: 40px; text-decoration: none; border: 1px solid ${COLORS.border};">
                                                        📞
                                                    </a>
                                                </td>
                                                <td style="padding: 0 10px;">
                                                    <a href="https://wa.me/94722885885" style="display: inline-block; width: 40px; height: 40px; background-color: ${COLORS.darkCard}; border-radius: 50%; text-align: center; line-height: 40px; text-decoration: none; border: 1px solid ${COLORS.border};">
                                                        💬
                                                    </a>
                                                </td>
                                                <td style="padding: 0 10px;">
                                                    <a href="mailto:airporttaxis.lk@gmail.com" style="display: inline-block; width: 40px; height: 40px; background-color: ${COLORS.darkCard}; border-radius: 50%; text-align: center; line-height: 40px; text-decoration: none; border: 1px solid ${COLORS.border};">
                                                        ✉️
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 8px; color: ${COLORS.textMuted}; font-size: 13px; text-align: center;">
                                📍 118/5 St. Joseph Street, Grandpass, Colombo 14
                            </p>
                            <p style="margin: 0 0 8px; color: ${COLORS.textMuted}; font-size: 13px; text-align: center;">
                                📞 +94 722 885 885 · +94 112 433 433
                            </p>
                            <p style="margin: 20px 0 0; color: #475569; font-size: 11px; text-align: center; letter-spacing: 1px;">
                                © ${new Date().getFullYear()} AIRPORT TAXIS (PVT) LTD · ALL RIGHTS RESERVED
                            </p>
                        </td>
                    </tr>
                </table>
                
                <!-- Unsubscribe -->
                <p style="margin: 20px 0 0; color: #475569; font-size: 11px; text-align: center;">
                    <a href="${BASE_URL}/unsubscribe" style="color: #64748b; text-decoration: underline;">Unsubscribe</a> · 
                    <a href="${BASE_URL}/privacy" style="color: #64748b; text-decoration: underline;">Privacy Policy</a>
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
`;

// Reusable Components
const components = {
    // Status Badge
    badge: (text, type = 'success') => {
        const colors = {
            success: { bg: '#052e16', border: '#166534', text: '#4ade80' },
            warning: { bg: '#451a03', border: '#92400e', text: '#fbbf24' },
            info: { bg: '#172554', border: '#1e40af', text: '#60a5fa' },
            gold: { bg: '#3f2c06', border: COLORS.gold, text: COLORS.goldLight }
        };
        const c = colors[type] || colors.success;
        return `<span style="display: inline-block; background-color: ${c.bg}; border: 1px solid ${c.border}; color: ${c.text}; padding: 6px 14px; border-radius: 50px; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">${text}</span>`;
    },

    // Info Card with Icon
    infoCard: (icon, label, value, highlight = false) => `
        <tr>
            <td style="padding: 16px 20px; border-bottom: 1px solid ${COLORS.border};">
                <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                        <td width="40" style="vertical-align: top;">
                            <span style="font-size: 20px;">${icon}</span>
                        </td>
                        <td>
                            <p style="margin: 0 0 4px; color: ${COLORS.textMuted}; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">${label}</p>
                            <p style="margin: 0; color: ${highlight ? COLORS.goldLight : COLORS.text}; font-size: ${highlight ? '22px' : '16px'}; font-weight: ${highlight ? '700' : '500'};">${value}</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    `,

    // CTA Button
    button: (text, url, primary = true) => `
        <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
                <td align="center" style="padding: 30px 0 10px;">
                    <a href="${url}" style="display: inline-block; background: ${primary ? `linear-gradient(135deg, ${COLORS.primary}, #047857)` : 'transparent'}; color: ${primary ? '#ffffff' : COLORS.primaryLight}; padding: 16px 40px; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; letter-spacing: 0.5px; border: ${primary ? 'none' : `2px solid ${COLORS.border}`}; box-shadow: ${primary ? '0 4px 14px rgba(5, 150, 105, 0.4)' : 'none'};">
                        ${text}
                    </a>
                </td>
            </tr>
        </table>
    `,

    // Section Header
    sectionHeader: (icon, title) => `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
            <tr>
                <td>
                    <p style="margin: 0; color: ${COLORS.text}; font-size: 18px; font-weight: 700;">
                        <span style="margin-right: 10px;">${icon}</span>${title}
                    </p>
                </td>
            </tr>
        </table>
    `,

    // Divider
    divider: () => `<tr><td style="padding: 20px 0;"><div style="height: 1px; background: linear-gradient(90deg, transparent, ${COLORS.border}, transparent);"></div></td></tr>`
};

// ============================================
// EMAIL TEMPLATES
// ============================================

// 1. BOOKING CONFIRMATION
export async function sendBookingConfirmation(booking) {
    const pickupShort = booking.pickupLocation?.address?.split(',')[0] || 'Pickup';
    const dropoffShort = booking.dropoffLocation?.address?.split(',')[0] || 'Dropoff';
    const bookingId = booking._id?.toString().slice(-8).toUpperCase();

    const customerContent = `
        <!-- Hero Section -->
        <table width="100%" cellpadding="0" cellspacing="0" style="text-align: center; margin-bottom: 30px;">
            <tr>
                <td>
                    ${components.badge('✓ Booking Confirmed', 'success')}
                    <h2 style="color: ${COLORS.text}; margin: 20px 0 10px; font-size: 24px; font-weight: 700;">
                        Thank You, ${booking.customerName?.split(' ')[0] || 'Traveler'}!
                    </h2>
                    <p style="color: ${COLORS.textMuted}; margin: 0; font-size: 14px;">
                        Your airport transfer has been confirmed. Here are your trip details.
                    </p>
                </td>
            </tr>
        </table>

        <!-- Booking ID Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, ${COLORS.primary}, #047857); border-radius: 16px; margin-bottom: 30px;">
            <tr>
                <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 8px; color: rgba(255,255,255,0.7); font-size: 11px; text-transform: uppercase; letter-spacing: 2px;">Booking Reference</p>
                    <p style="margin: 0; color: ${COLORS.goldLight}; font-size: 32px; font-weight: 800; letter-spacing: 4px; font-family: monospace;">#${bookingId}</p>
                </td>
            </tr>
        </table>

        <!-- Trip Details Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.dark}; border-radius: 16px; border: 1px solid ${COLORS.border}; overflow: hidden; margin-bottom: 30px;">
            ${components.infoCard('📍', 'Pickup Location', pickupShort)}
            ${components.infoCard('🏁', 'Drop-off Location', dropoffShort)}
            ${components.infoCard('📅', 'Date & Time', `${booking.scheduledDate || 'Immediate'} ${booking.scheduledTime ? `at ${booking.scheduledTime}` : ''}`)}
            ${components.infoCard('🚗', 'Vehicle', booking.vehicleType || 'Standard')}
            ${components.infoCard('📏', 'Distance', `${booking.distance || 0} km`)}
            <tr>
                <td style="padding: 20px; background: linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.05));">
                    <table width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                            <td width="40" style="vertical-align: top;">
                                <span style="font-size: 20px;">💰</span>
                            </td>
                            <td>
                                <p style="margin: 0 0 4px; color: ${COLORS.textMuted}; font-size: 11px; text-transform: uppercase; letter-spacing: 1px;">Total Amount</p>
                                <p style="margin: 0; color: ${COLORS.goldLight}; font-size: 28px; font-weight: 800;">LKR ${booking.totalPrice?.toLocaleString() || 0}</p>
                                <p style="margin: 4px 0 0; color: ${COLORS.textMuted}; font-size: 12px;">${booking.paymentMethod === 'card' ? '💳 Paid Online' : '💵 Cash on Arrival'}</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        ${booking.hasNameBoard ? `
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(212,175,55,0.1); border: 1px solid ${COLORS.gold}; border-radius: 12px; margin-bottom: 20px;">
            <tr>
                <td style="padding: 16px 20px; text-align: center;">
                    <span style="color: ${COLORS.goldLight}; font-size: 14px;">🪧 <strong>Name Board Requested</strong> - Driver will hold a sign with your name at the airport</span>
                </td>
            </tr>
        </table>
        ` : ''}

        <!-- What's Next -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.dark}; border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid ${COLORS.border};">
            <tr>
                <td style="padding: 20px;">
                    <p style="margin: 0 0 15px; color: ${COLORS.text}; font-size: 16px; font-weight: 600;">📋 What's Next?</p>
                    <p style="margin: 0 0 8px; color: ${COLORS.textMuted}; font-size: 14px; line-height: 1.6;">• We'll assign a driver and send you their details</p>
                    <p style="margin: 0 0 8px; color: ${COLORS.textMuted}; font-size: 14px; line-height: 1.6;">• Driver will contact you before pickup</p>
                    <p style="margin: 0; color: ${COLORS.textMuted}; font-size: 14px; line-height: 1.6;">• Track your ride in real-time on our website</p>
                </td>
            </tr>
        </table>

        ${components.button('View My Booking', `${BASE_URL}/my-bookings`)}

        <!-- Help Banner -->
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
            <tr>
                <td style="text-align: center;">
                    <p style="margin: 0; color: ${COLORS.textMuted}; font-size: 13px;">
                        Need help? WhatsApp us at <a href="https://wa.me/94722885885" style="color: ${COLORS.primaryLight}; text-decoration: none; font-weight: 600;">+94 722 885 885</a>
                    </p>
                </td>
            </tr>
        </table>
    `;

    // Send to customer
    if (booking.customerEmail) {
        try {
            const resend = getResend();
            if (resend) {
                await resend.emails.send({
                    from: FROM_EMAIL,
                    to: booking.customerEmail,
                    subject: `✅ Booking Confirmed #${bookingId} - Airport Taxis`,
                    html: getPremiumTemplate(customerContent, 'Booking Confirmation')
                });
                console.log('[Email] Booking confirmation sent to customer:', booking.customerEmail);
            }
        } catch (error) {
            console.error('[Email] Failed to send customer booking confirmation:', error);
        }
    }

    // Send copy to owner (simplified)
    const ownerContent = `
        <h2 style="color: ${COLORS.text}; margin: 0 0 20px;">📢 New Booking Received!</h2>
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(245,158,11,0.1); border-radius: 12px; border: 1px solid ${COLORS.warning};">
            <tr><td style="padding: 20px;">
                <p style="margin: 0 0 10px;"><strong>ID:</strong> #${bookingId}</p>
                <p style="margin: 0 0 10px;"><strong>Customer:</strong> ${booking.customerName || 'Guest'}</p>
                <p style="margin: 0 0 10px;"><strong>Phone:</strong> ${booking.guestPhone || 'N/A'}</p>
                <p style="margin: 0 0 10px;"><strong>Email:</strong> ${booking.customerEmail || 'N/A'}</p>
                <hr style="border: none; border-top: 1px solid ${COLORS.warning}; margin: 15px 0;">
                <p style="margin: 0 0 10px;"><strong>Route:</strong> ${pickupShort} → ${dropoffShort}</p>
                <p style="margin: 0 0 10px;"><strong>Date:</strong> ${booking.scheduledDate || 'Immediate'} ${booking.scheduledTime || ''}</p>
                <p style="margin: 0 0 10px;"><strong>Vehicle:</strong> ${booking.vehicleType || 'Standard'}</p>
                <p style="margin: 0;"><strong>Total:</strong> LKR ${booking.totalPrice?.toLocaleString() || 0}</p>
            </td></tr>
        </table>
        ${components.button('Go to Admin Panel', `${BASE_URL}/admin`)}
    `;

    try {
        const resend = getResend();
        if (resend) {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: OWNER_EMAIL,
                subject: `🚨 NEW BOOKING #${bookingId} - ${booking.customerName || 'Guest'}`,
                html: getPremiumTemplate(ownerContent, 'New Booking Alert')
            });
            console.log('[Email] Booking notification sent to owner');
        }
    } catch (error) {
        console.error('[Email] Failed to send owner booking notification:', error);
    }
}

// 2. PAYMENT CONFIRMATION
export async function sendPaymentConfirmation(booking) {
    const bookingId = booking._id?.toString().slice(-8).toUpperCase();

    const content = `
        <!-- Hero Section -->
        <table width="100%" cellpadding="0" cellspacing="0" style="text-align: center; margin-bottom: 30px;">
            <tr>
                <td>
                    ${components.badge('💳 Payment Successful', 'gold')}
                    <h2 style="color: ${COLORS.text}; margin: 20px 0 10px; font-size: 24px; font-weight: 700;">
                        Payment Received!
                    </h2>
                    <p style="color: ${COLORS.textMuted}; margin: 0; font-size: 14px;">
                        Thank you for your payment. Here's your receipt.
                    </p>
                </td>
            </tr>
        </table>

        <!-- Amount Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #3f2c06, #1f1608); border: 2px solid ${COLORS.gold}; border-radius: 16px; margin-bottom: 30px;">
            <tr>
                <td style="padding: 30px; text-align: center;">
                    <p style="margin: 0 0 8px; color: ${COLORS.goldLight}; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Amount Paid</p>
                    <p style="margin: 0; color: #ffffff; font-size: 42px; font-weight: 800;">LKR ${booking.totalPrice?.toLocaleString() || 0}</p>
                </td>
            </tr>
        </table>

        <!-- Receipt Details -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.dark}; border-radius: 16px; border: 1px solid ${COLORS.border}; overflow: hidden; margin-bottom: 30px;">
            ${components.infoCard('🧾', 'Transaction ID', booking.transactionId || bookingId)}
            ${components.infoCard('📋', 'Booking Reference', `#${bookingId}`)}
            ${components.infoCard('💳', 'Payment Method', booking.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Online Payment')}
            ${components.infoCard('📅', 'Payment Date', new Date().toLocaleDateString('en-LK', { dateStyle: 'full' }))}
        </table>

        <!-- Confirmation -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(34,197,94,0.1); border: 1px solid ${COLORS.success}; border-radius: 12px; margin-bottom: 20px;">
            <tr>
                <td style="padding: 20px; text-align: center;">
                    <span style="color: ${COLORS.success}; font-size: 14px;">✅ Your booking is confirmed. Our driver will contact you before pickup.</span>
                </td>
            </tr>
        </table>

        ${components.button('View Booking Details', `${BASE_URL}/my-bookings`)}
    `;

    if (booking.customerEmail) {
        try {
            const resend = getResend();
            if (resend) {
                await resend.emails.send({
                    from: FROM_EMAIL,
                    to: booking.customerEmail,
                    subject: `💳 Payment Confirmed - LKR ${booking.totalPrice?.toLocaleString()} - Airport Taxis`,
                    html: getPremiumTemplate(content, 'Payment Confirmation')
                });
                console.log('[Email] Payment confirmation sent to:', booking.customerEmail);
            }
        } catch (error) {
            console.error('[Email] Failed to send payment confirmation:', error);
        }
    }
}

// 3. DRIVER ASSIGNED (NEW!)
export async function sendDriverAssigned(booking, driver) {
    const bookingId = booking._id?.toString().slice(-8).toUpperCase();
    const pickupShort = booking.pickupLocation?.address?.split(',')[0] || 'Pickup';

    const content = `
        <!-- Hero Section -->
        <table width="100%" cellpadding="0" cellspacing="0" style="text-align: center; margin-bottom: 30px;">
            <tr>
                <td>
                    ${components.badge('🚗 Driver Assigned', 'success')}
                    <h2 style="color: ${COLORS.text}; margin: 20px 0 10px; font-size: 24px; font-weight: 700;">
                        Your Driver is Ready!
                    </h2>
                    <p style="color: ${COLORS.textMuted}; margin: 0; font-size: 14px;">
                        Great news! A driver has been assigned to your booking.
                    </p>
                </td>
            </tr>
        </table>

        <!-- Driver Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, ${COLORS.primary}, #047857); border-radius: 16px; margin-bottom: 30px; overflow: hidden;">
            <tr>
                <td style="padding: 30px; text-align: center;">
                    <!-- Driver Avatar -->
                    <div style="width: 80px; height: 80px; background-color: rgba(255,255,255,0.2); border-radius: 50%; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center; font-size: 40px; border: 3px solid ${COLORS.gold};">
                        👤
                    </div>
                    <p style="margin: 0 0 5px; color: #ffffff; font-size: 22px; font-weight: 700;">${driver.name || 'Your Driver'}</p>
                    <p style="margin: 0; color: rgba(255,255,255,0.7); font-size: 14px;">⭐ ${driver.rating || '4.9'} Rating · ${driver.trips || '500'}+ Trips</p>
                </td>
            </tr>
        </table>

        <!-- Driver Details -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.dark}; border-radius: 16px; border: 1px solid ${COLORS.border}; overflow: hidden; margin-bottom: 30px;">
            ${components.infoCard('📱', 'Phone Number', driver.phone || 'Will be shared soon')}
            ${components.infoCard('🚗', 'Vehicle', `${driver.vehicleMake || 'Toyota'} ${driver.vehicleModel || 'Prius'}`)}
            ${components.infoCard('🔢', 'Vehicle Number', driver.vehicleNumber || 'CAB-XXXX')}
            ${components.infoCard('📍', 'Pickup Location', pickupShort)}
            ${components.infoCard('📅', 'Pickup Date', `${booking.scheduledDate || 'Today'} at ${booking.scheduledTime || 'Soon'}`)}
        </table>

        <!-- Instructions -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(212,175,55,0.1); border: 1px solid ${COLORS.gold}; border-radius: 12px; margin-bottom: 20px;">
            <tr>
                <td style="padding: 20px;">
                    <p style="margin: 0 0 10px; color: ${COLORS.goldLight}; font-size: 14px; font-weight: 600;">💡 Tips for a smooth pickup:</p>
                    <p style="margin: 0 0 6px; color: ${COLORS.textMuted}; font-size: 13px;">• Driver will call you 15 minutes before arrival</p>
                    <p style="margin: 0 0 6px; color: ${COLORS.textMuted}; font-size: 13px;">• Look for the vehicle number at the pickup point</p>
                    <p style="margin: 0; color: ${COLORS.textMuted}; font-size: 13px;">• Keep your phone accessible for driver contact</p>
                </td>
            </tr>
        </table>

        ${components.button('Track My Ride', `${BASE_URL}/booking/${booking._id}`)}
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
            <tr>
                <td style="text-align: center;">
                    <a href="tel:${driver.phone || '+94722885885'}" style="color: ${COLORS.primaryLight}; text-decoration: none; font-size: 14px; font-weight: 600;">
                        📞 Call Driver Now
                    </a>
                </td>
            </tr>
        </table>
    `;

    if (booking.customerEmail) {
        try {
            const resend = getResend();
            if (resend) {
                await resend.emails.send({
                    from: FROM_EMAIL,
                    to: booking.customerEmail,
                    subject: `🚗 Driver Assigned - ${driver.name || 'Your Driver'} for Booking #${bookingId}`,
                    html: getPremiumTemplate(content, 'Driver Assigned')
                });
                console.log('[Email] Driver assigned email sent to:', booking.customerEmail);
            }
        } catch (error) {
            console.error('[Email] Failed to send driver assigned email:', error);
        }
    }
}

// 4. TRIP REMINDER (NEW! - 24h before)
export async function sendTripReminder(booking) {
    const bookingId = booking._id?.toString().slice(-8).toUpperCase();
    const pickupShort = booking.pickupLocation?.address?.split(',')[0] || 'Pickup';
    const dropoffShort = booking.dropoffLocation?.address?.split(',')[0] || 'Dropoff';

    const content = `
        <!-- Hero Section -->
        <table width="100%" cellpadding="0" cellspacing="0" style="text-align: center; margin-bottom: 30px;">
            <tr>
                <td>
                    ${components.badge('⏰ Trip Tomorrow', 'warning')}
                    <h2 style="color: ${COLORS.text}; margin: 20px 0 10px; font-size: 24px; font-weight: 700;">
                        Your Trip is Tomorrow!
                    </h2>
                    <p style="color: ${COLORS.textMuted}; margin: 0; font-size: 14px;">
                        Just a friendly reminder about your upcoming airport transfer.
                    </p>
                </td>
            </tr>
        </table>

        <!-- Countdown Timer Visual -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, ${COLORS.warning}, #d97706); border-radius: 16px; margin-bottom: 30px;">
            <tr>
                <td style="padding: 30px; text-align: center;">
                    <p style="margin: 0 0 10px; color: rgba(255,255,255,0.8); font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Pickup Time</p>
                    <p style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 800;">${booking.scheduledTime || '10:00 AM'}</p>
                    <p style="margin: 10px 0 0; color: rgba(255,255,255,0.8); font-size: 16px;">${booking.scheduledDate || 'Tomorrow'}</p>
                </td>
            </tr>
        </table>

        <!-- Trip Summary -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.dark}; border-radius: 16px; border: 1px solid ${COLORS.border}; overflow: hidden; margin-bottom: 30px;">
            ${components.infoCard('📋', 'Booking ID', `#${bookingId}`)}
            ${components.infoCard('📍', 'Pickup', pickupShort)}
            ${components.infoCard('🏁', 'Drop-off', dropoffShort)}
            ${components.infoCard('🚗', 'Vehicle', booking.vehicleType || 'Standard')}
        </table>

        <!-- Checklist -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.dark}; border-radius: 12px; border: 1px solid ${COLORS.border}; margin-bottom: 20px;">
            <tr>
                <td style="padding: 20px;">
                    <p style="margin: 0 0 15px; color: ${COLORS.text}; font-size: 16px; font-weight: 600;">✅ Pre-Trip Checklist</p>
                    <p style="margin: 0 0 8px; color: ${COLORS.textMuted}; font-size: 14px;">☐ Passport/ID ready</p>
                    <p style="margin: 0 0 8px; color: ${COLORS.textMuted}; font-size: 14px;">☐ Flight details confirmed</p>
                    <p style="margin: 0 0 8px; color: ${COLORS.textMuted}; font-size: 14px;">☐ Phone charged for driver contact</p>
                    <p style="margin: 0; color: ${COLORS.textMuted}; font-size: 14px;">☐ Luggage packed</p>
                </td>
            </tr>
        </table>

        ${components.button('View Booking Details', `${BASE_URL}/my-bookings`)}
        
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
            <tr>
                <td style="text-align: center;">
                    <p style="margin: 0; color: ${COLORS.textMuted}; font-size: 13px;">
                        Need to make changes? <a href="https://wa.me/94722885885" style="color: ${COLORS.primaryLight}; text-decoration: none; font-weight: 600;">Contact us on WhatsApp</a>
                    </p>
                </td>
            </tr>
        </table>
    `;

    if (booking.customerEmail) {
        try {
            const resend = getResend();
            if (resend) {
                await resend.emails.send({
                    from: FROM_EMAIL,
                    to: booking.customerEmail,
                    subject: `⏰ Reminder: Your Trip Tomorrow at ${booking.scheduledTime || '10:00 AM'} - Airport Taxis`,
                    html: getPremiumTemplate(content, 'Trip Reminder')
                });
                console.log('[Email] Trip reminder sent to:', booking.customerEmail);
            }
        } catch (error) {
            console.error('[Email] Failed to send trip reminder:', error);
        }
    }
}

// 5. TRIP COMPLETED
export async function sendTripCompletedNotification(booking) {
    const pickupShort = booking.pickupLocation?.address?.split(',')[0] || 'Pickup';
    const dropoffShort = booking.dropoffLocation?.address?.split(',')[0] || 'Dropoff';

    const content = `
        <!-- Hero Section -->
        <table width="100%" cellpadding="0" cellspacing="0" style="text-align: center; margin-bottom: 30px;">
            <tr>
                <td>
                    <div style="font-size: 60px; margin-bottom: 15px;">🎉</div>
                    <h2 style="color: ${COLORS.text}; margin: 0 0 10px; font-size: 24px; font-weight: 700;">
                        Trip Completed!
                    </h2>
                    <p style="color: ${COLORS.textMuted}; margin: 0; font-size: 14px;">
                        Thank you for travelling with Airport Taxis. We hope you had a great ride!
                    </p>
                </td>
            </tr>
        </table>

        <!-- Trip Summary -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.dark}; border-radius: 16px; border: 1px solid ${COLORS.border}; overflow: hidden; margin-bottom: 30px;">
            ${components.infoCard('📍', 'Route', `${pickupShort} → ${dropoffShort}`)}
            ${components.infoCard('📏', 'Distance Covered', `${booking.distance || 0} km`)}
            ${components.infoCard('💰', 'Total Paid', `LKR ${booking.totalPrice?.toLocaleString() || 0}`, true)}
        </table>

        <!-- Review CTA -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, rgba(245,158,11,0.2), rgba(217,119,6,0.1)); border: 1px solid ${COLORS.warning}; border-radius: 16px; margin-bottom: 30px;">
            <tr>
                <td style="padding: 30px; text-align: center;">
                    <p style="margin: 0 0 10px; font-size: 30px;">⭐⭐⭐⭐⭐</p>
                    <p style="margin: 0 0 8px; color: ${COLORS.text}; font-size: 18px; font-weight: 700;">How was your trip?</p>
                    <p style="margin: 0 0 20px; color: ${COLORS.textMuted}; font-size: 14px;">Your feedback helps us improve and helps other travelers!</p>
                    <a href="${BASE_URL}/review/${booking._id}" style="display: inline-block; background: linear-gradient(135deg, ${COLORS.warning}, #d97706); color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 10px; font-weight: 700; font-size: 14px;">
                        Leave a Review
                    </a>
                </td>
            </tr>
        </table>

        ${components.button('Book Another Trip', `${BASE_URL}`, false)}
    `;

    if (booking.customerEmail) {
        try {
            const resend = getResend();
            if (resend) {
                await resend.emails.send({
                    from: FROM_EMAIL,
                    to: booking.customerEmail,
                    subject: '🎉 Trip Completed - Thank You for Travelling with Us!',
                    html: getPremiumTemplate(content, 'Trip Completed')
                });
                console.log('[Email] Trip completion notification sent to:', booking.customerEmail);
            }
        } catch (error) {
            console.error('[Email] Failed to send trip completion email:', error);
        }
    }
}

// 6. REVIEW THANK YOU
export async function sendReviewThankYou(review) {
    const content = `
        <!-- Hero Section -->
        <table width="100%" cellpadding="0" cellspacing="0" style="text-align: center; margin-bottom: 30px;">
            <tr>
                <td>
                    <div style="font-size: 50px; margin-bottom: 15px;">${'⭐'.repeat(review.rating || 5)}</div>
                    <h2 style="color: ${COLORS.text}; margin: 0 0 10px; font-size: 24px; font-weight: 700;">
                        Thank You for Your Review!
                    </h2>
                    <p style="color: ${COLORS.textMuted}; margin: 0; font-size: 14px;">
                        We truly appreciate your feedback, ${review.userName || 'Valued Customer'}.
                    </p>
                </td>
            </tr>
        </table>

        <!-- Review Card -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.dark}; border-radius: 16px; border: 1px solid ${COLORS.border}; margin-bottom: 30px;">
            <tr>
                <td style="padding: 25px;">
                    <p style="margin: 0 0 15px; color: ${COLORS.goldLight}; font-size: 16px; font-style: italic; line-height: 1.6;">
                        "${review.comment || 'Great service!'}"
                    </p>
                    <p style="margin: 0; color: ${COLORS.textMuted}; font-size: 13px;">
                        📍 ${review.route || 'Airport Transfer'}
                    </p>
                </td>
            </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(34,197,94,0.1); border: 1px solid ${COLORS.success}; border-radius: 12px; margin-bottom: 20px;">
            <tr>
                <td style="padding: 16px 20px; text-align: center;">
                    <span style="color: ${COLORS.success}; font-size: 14px;">✅ Your review will be published after approval</span>
                </td>
            </tr>
        </table>

        ${components.button('Book Another Trip', `${BASE_URL}`)}
    `;

    if (review.userEmail) {
        try {
            const resend = getResend();
            if (resend) {
                await resend.emails.send({
                    from: FROM_EMAIL,
                    to: review.userEmail,
                    subject: '⭐ Thank You for Your Review - Airport Taxis',
                    html: getPremiumTemplate(content, 'Review Thank You')
                });
                console.log('[Email] Review thank you sent to:', review.userEmail);
            }
        } catch (error) {
            console.error('[Email] Failed to send review thank you:', error);
        }
    }
}

// 7. LOGIN NOTIFICATION
export async function sendLoginNotification(user) {
    const content = `
        <table width="100%" cellpadding="0" cellspacing="0" style="text-align: center; margin-bottom: 30px;">
            <tr>
                <td>
                    ${components.badge('🔐 Login Detected', 'info')}
                    <h2 style="color: ${COLORS.text}; margin: 20px 0 10px; font-size: 24px; font-weight: 700;">
                        Welcome Back!
                    </h2>
                    <p style="color: ${COLORS.textMuted}; margin: 0; font-size: 14px;">
                        Hi ${user.name || 'Valued Customer'}, you've logged into your account.
                    </p>
                </td>
            </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${COLORS.dark}; border-radius: 16px; border: 1px solid ${COLORS.border}; overflow: hidden; margin-bottom: 30px;">
            ${components.infoCard('📧', 'Email', user.email)}
            ${components.infoCard('🕐', 'Time', new Date().toLocaleString('en-LK', { timeZone: 'Asia/Colombo' }))}
            ${components.infoCard('🌐', 'Location', 'Sri Lanka')}
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: rgba(239,68,68,0.1); border: 1px solid #ef4444; border-radius: 12px; margin-bottom: 20px;">
            <tr>
                <td style="padding: 16px 20px; text-align: center;">
                    <span style="color: #f87171; font-size: 13px;">⚠️ If this wasn't you, please <a href="${BASE_URL}/support" style="color: #f87171; font-weight: 600;">contact us immediately</a></span>
                </td>
            </tr>
        </table>

        ${components.button('Book a Ride', `${BASE_URL}`)}
    `;

    try {
        const resend = getResend();
        if (!resend) return;

        await resend.emails.send({
            from: FROM_EMAIL,
            to: user.email,
            subject: '🔐 Login Notification - Airport Taxis Sri Lanka',
            html: getPremiumTemplate(content, 'Login Notification')
        });
        console.log('[Email] Login notification sent to:', user.email);
    } catch (error) {
        console.error('[Email] Failed to send login notification:', error);
    }
}

// Export all functions
export default {
    sendLoginNotification,
    sendBookingConfirmation,
    sendPaymentConfirmation,
    sendDriverAssigned,
    sendTripReminder,
    sendTripCompletedNotification,
    sendReviewThankYou
};

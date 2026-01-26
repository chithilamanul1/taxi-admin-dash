// Discord Webhook Utility for Audit Logging
// All site activities are logged to Discord for monitoring

const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

/**
 * Send a message to Discord webhook
 * @param {object} options - Message options
 */
export async function sendDiscordLog(options) {
    const {
        title,
        description,
        color = 0x10b981, // Emerald green
        fields = [],
        footer = null,
        timestamp = true
    } = options;

    if (!DISCORD_WEBHOOK_URL) {
        console.log('[Discord] Webhook URL not configured, skipping log:', title);
        return;
    }

    const embed = {
        title,
        description,
        color,
        fields: fields.map(f => ({
            name: f.name,
            value: String(f.value).substring(0, 1024), // Discord limit
            inline: f.inline ?? true
        })),
        timestamp: timestamp ? new Date().toISOString() : undefined,
        footer: footer ? { text: footer } : { text: 'Airport Taxis Audit Log' }
    };

    try {
        const response = await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ embeds: [embed] })
        });

        if (!response.ok) {
            console.error('[Discord] Failed to send log:', response.status);
        }
    } catch (error) {
        console.error('[Discord] Error sending log:', error);
    }
}

// Predefined log types with colors
export const DiscordColors = {
    SUCCESS: 0x22c55e,    // Green
    INFO: 0x3b82f6,       // Blue
    WARNING: 0xf59e0b,    // Amber
    ERROR: 0xef4444,      // Red
    BOOKING: 0x10b981,    // Emerald
    LOGIN: 0x8b5cf6,      // Purple
    PAYMENT: 0x06b6d4,    // Cyan
    REVIEW: 0xec4899,     // Pink
    ADMIN: 0xf97316       // Orange
};

// Convenience functions for common logs
export async function logBookingCreated(booking) {
    await sendDiscordLog({
        title: '🚕 New Booking Created',
        color: DiscordColors.BOOKING,
        fields: [
            { name: 'Booking ID', value: booking._id || 'N/A' },
            { name: 'Customer', value: booking.customerName || 'Guest' },
            { name: 'Phone', value: booking.guestPhone || 'N/A' },
            { name: 'Email', value: booking.customerEmail || 'N/A' },
            { name: 'Pickup', value: booking.pickupLocation?.address || 'N/A', inline: false },
            { name: 'Dropoff', value: booking.dropoffLocation?.address || 'N/A', inline: false },
            { name: 'Distance', value: `${booking.distance || 0} km` },
            { name: 'Vehicle', value: booking.vehicleType || 'N/A' },
            { name: 'Total', value: `LKR ${booking.totalPrice?.toLocaleString() || 0}` },
            { name: 'Payment', value: booking.paymentMethod || 'N/A' },
            { name: 'Date', value: booking.scheduledDate || 'Immediate' },
            { name: 'Time', value: booking.scheduledTime || 'N/A' }
        ]
    });
}

export async function logBookingStatusChanged(booking, newStatus, changedBy) {
    await sendDiscordLog({
        title: '📋 Booking Status Updated',
        color: newStatus === 'completed' ? DiscordColors.SUCCESS : DiscordColors.INFO,
        fields: [
            { name: 'Booking ID', value: booking._id },
            { name: 'Customer', value: booking.customerName || 'Guest' },
            { name: 'New Status', value: newStatus.toUpperCase() },
            { name: 'Changed By', value: changedBy || 'System' },
            { name: 'Route', value: `${booking.pickupLocation?.address?.split(',')[0]} → ${booking.dropoffLocation?.address?.split(',')[0]}`, inline: false }
        ]
    });
}

export async function logUserLogin(user, method = 'Google') {
    await sendDiscordLog({
        title: '🔐 User Login',
        color: DiscordColors.LOGIN,
        fields: [
            { name: 'User', value: user.name || user.email || 'Unknown' },
            { name: 'Email', value: user.email || 'N/A' },
            { name: 'Method', value: method },
            { name: 'Time', value: new Date().toLocaleString('en-LK', { timeZone: 'Asia/Colombo' }) }
        ]
    });
}

export async function logPaymentReceived(booking, paymentDetails) {
    await sendDiscordLog({
        title: '💳 Payment Received',
        color: DiscordColors.PAYMENT,
        fields: [
            { name: 'Booking ID', value: booking._id },
            { name: 'Amount', value: `LKR ${booking.totalPrice?.toLocaleString()}` },
            { name: 'Method', value: paymentDetails.method || 'Card' },
            { name: 'Transaction ID', value: paymentDetails.transactionId || 'N/A' },
            { name: 'Customer', value: booking.customerName || 'Guest' }
        ]
    });
}

export async function logNewReview(review) {
    await sendDiscordLog({
        title: '⭐ New Customer Review',
        color: DiscordColors.REVIEW,
        fields: [
            { name: 'Customer', value: review.customerName || 'Anonymous' },
            { name: 'Rating', value: '⭐'.repeat(review.rating) },
            { name: 'Route', value: review.route || 'N/A', inline: false },
            { name: 'Distance', value: `${review.distance || 0} km` },
            { name: 'Review', value: review.text || 'No comment', inline: false }
        ]
    });
}

export async function logError(error, context) {
    await sendDiscordLog({
        title: '🚨 System Error',
        color: DiscordColors.ERROR,
        fields: [
            { name: 'Context', value: context || 'Unknown' },
            { name: 'Error', value: error.message || String(error), inline: false },
            { name: 'Stack', value: error.stack?.substring(0, 500) || 'N/A', inline: false }
        ]
    });
}

export async function logAdminAction(admin, action, details) {
    await sendDiscordLog({
        title: '👤 Admin Action',
        color: DiscordColors.ADMIN,
        fields: [
            { name: 'Admin', value: admin || 'System' },
            { name: 'Action', value: action },
            { name: 'Details', value: details || 'N/A', inline: false }
        ]
    });
}
export async function logTicketCreated(ticket) {
    await sendDiscordLog({
        title: '🎫 New Support Ticket',
        color: DiscordColors.WARNING,
        fields: [
            { name: 'Subject', value: ticket.subject },
            { name: 'Priority', value: ticket.priority.toUpperCase() },
            { name: 'User ID', value: String(ticket.user) },
            { name: 'Message', value: ticket.messages[0]?.message.substring(0, 200) || 'No content' }
        ]
    });
}

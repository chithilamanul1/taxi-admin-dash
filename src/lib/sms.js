/**
 * SMS Service
 * Modular service to handle SMS notifications.
 * Can be hooked up to Notify.lk, Twilio, or any other gateway via env vars.
 */

const SMS_API_URL = process.env.SMS_API_URL;
const SMS_API_KEY = process.env.SMS_API_KEY;

export async function sendSMS(toPhone, message) {
    if (!toPhone) return false;
    
    // Normalize phone number (strip spaces/plus if needed by gateway)
    const phone = toPhone.replace(/[^0-9]/g, '');

    if (!SMS_API_URL || !SMS_API_KEY) {
        // Fallback: Log to console if no gateway configured
        console.log(\`[MOCK SMS] To: \${phone} | Message: \${message}\`);
        return true;
    }

    try {
        // Example integration for a generic JSON API (like Twilio/Notify)
        const response = await fetch(SMS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${SMS_API_KEY}\`
            },
            body: JSON.stringify({
                to: phone,
                message: message
            })
        });

        if (!response.ok) {
            throw new Error(\`SMS API returned \${response.status}\`);
        }

        console.log(\`[SMS] Successfully sent to \${phone}\`);
        return true;
    } catch (error) {
        console.error('[SMS Error]:', error.message);
        return false;
    }
}

export async function sendDriverAssignmentSMS(booking) {
    if (!booking || !booking.driver || !booking.driver.phone) return;

    const bookingId = booking._id?.toString().slice(-8).toUpperCase();
    const pickupShort = booking.pickupLocation?.address?.split(',')[0] || 'Pickup';
    const dropoffShort = booking.dropoffLocation?.address?.split(',')[0] || 'Dropoff';
    const date = booking.scheduledDate || 'Immediate';
    const time = booking.scheduledTime || '';
    
    const message = \`Airport Taxis: You have a new ride assigned (#\${bookingId}).\nFrom: \${pickupShort}\nTo: \${dropoffShort}\nTime: \${date} \${time}\nCustomer: \${booking.customerName} (\${booking.guestPhone})\nCheck your dashboard for details.\`;

    await sendSMS(booking.driver.phone, message);
}

import { Resend } from 'resend';

const FROM_EMAIL = 'Airport Taxi <onboarding@resend.dev>'; // Using default domain until user sets up custom domain

export const sendEmail = async ({ to, subject, html, text }) => {
    try {
        if (!process.env.RESEND_API_KEY) {
            console.error("RESEND_API_KEY is missing. Email skipped.");
            return { success: false, error: "Missing API Key" };
        }

        const { Resend } = await import('resend');
        const resend = new Resend(process.env.RESEND_API_KEY);

        const data = await resend.emails.send({
            from: FROM_EMAIL,
            to: to,
            subject: subject,
            html: html,
            text: text || '',
        });
        return { success: true, data };
    } catch (error) {
        console.error('Email Error:', error);
        return { success: false, error };
    }
};

// Templates
export const templates = {
    bookingConfirmation: (booking) => `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Booking Confirmed!</h1>
            <p>Hi ${booking.customerName || 'traveler'},</p>
            <p>Your booking (ID: ${booking._id.slice(-6)}) has been confirmed.</p>
            
            <div style="background: #f4f4f4; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p><strong>Pickup:</strong> ${booking.pickupLocation.address}</p>
                <p><strong>Dropoff:</strong> ${booking.dropoffLocation.address}</p>
                <p><strong>Date:</strong> ${booking.scheduledDate} at ${booking.scheduledTime}</p>
                <p><strong>Vehicle:</strong> ${booking.vehicleType}</p>
                <p style="font-size: 18px;"><strong>Total Price:</strong> Rs ${booking.totalPrice?.toLocaleString()}</p>
            </div>

            <p>We will notify you once a driver is assigned.</p>
            <p>Safe travels,<br/>Airport Taxi Tours</p>
        </div>
    `,
    welcome: (name) => `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Welcome to Airport Taxi Tours!</h1>
            <p>Hi ${name},</p>
            <p>Thank you for creating an account with us. You can now easily book rides, view your history, and manage your profile.</p>
            <p><a href="https://srilankantaxi.lk/prices">Book your first ride</a></p>
        </div>
    `
};

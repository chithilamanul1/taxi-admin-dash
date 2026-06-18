import { Resend } from 'resend';

const FROM_EMAIL = process.env.FROM_EMAIL || 'Airport Taxis <info@srilankantaxi.lk>';

export const sendEmail = async ({ to, subject, html, text }) => {
    try {
        const { Resend } = await import('resend');
        if (!process.env.RESEND_API_KEY) {
            console.error("RESEND_API_KEY is missing. Email skipped.");
            return { success: false, error: "Missing API Key" };
        }
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
            <p>Safe travels,<br/>Airport Taxis Tours</p>
        </div>
    `,
    welcome: (name) => `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h1>Welcome to Airport Taxis Tours!</h1>
            <p>Hi ${name},</p>
            <p>Thank you for creating an account with us. You can now easily book rides, view your history, and manage your profile.</p>
            <p><a href="https://srilankantaxi.lk/roundtrip">Book your first ride</a></p>
        </div>
    `,
    marketingOffer: (coupons) => `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 40px 20px;">
            <div style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                <div style="background-color: #111827; padding: 40px 20px; text-center; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 28px; text-transform: uppercase; letter-spacing: 2px;">Exclusive Offers</h1>
                    <p style="margin: 10px 0 0; color: #9ca3af; font-size: 14px;">Hand-picked deals just for you</p>
                </div>
                
                <div style="padding: 30px;">
                    ${coupons.map(coupon => `
                        <div style="border: 2px dashed #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 20px; background-color: #fffaf0;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                <div>
                                    <h2 style="margin: 0; color: #f59e0b; font-size: 24px; font-weight: 800;">
                                        ${coupon.discountType === 'percentage' ? `${coupon.value}% OFF` : `LKR ${coupon.value} OFF`}
                                    </h2>
                                    <p style="margin: 5px 0 0; color: #4b5563; font-size: 14px; font-weight: 600;">${coupon.description || 'Special Discount'}</p>
                                </div>
                            </div>
                            
                            <div style="margin-top: 20px; background-color: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #f3f4f6; text-align: center;">
                                <p style="margin: 0 0 5px; color: #9ca3af; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Use Promo Code</p>
                                <p style="margin: 0; color: #111827; font-size: 20px; font-weight: 900; letter-spacing: 2px;">${coupon.code}</p>
                            </div>

                            ${coupon.applicableLocations?.length > 0 ? `
                                <p style="margin: 15px 0 0; color: #6b7280; font-size: 12px;">Valid for: <strong>${coupon.applicableLocations.join(', ')}</strong></p>
                            ` : ''}

                            <div style="margin-top: 20px; text-align: center;">
                                <a href="https://srilankantaxi.lk/?coupon=${coupon.code}#booking" 
                                   style="display: inline-block; background-color: #f59e0b; color: #ffffff; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">
                                   BOOK NOW
                                </a>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <div style="background-color: #f3f4f6; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
                    <p style="margin: 0;">© ${new Date().getFullYear()} Airport Taxis Pvt (Ltd). Sri Lanka.</p>
                    <p style="margin: 10px 0 0;">If you'd rather not receive these emails, <a href="https://srilankantaxi.lk/unsubscribe" style="color: #6b7280; text-decoration: underline;">unsubscribe here</a>.</p>
                </div>
            </div>
        </div>
    `
};

/**
 * Handle batch emailing for marketing broadcasts
 */
export const sendBroadcast = async ({ recipients, subject, html }) => {
    try {
        const { Resend } = await import('resend');
        if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is missing");
        const resend = new Resend(process.env.RESEND_API_KEY);

        // Resend supports batching up to 100 emails per request
        const batchSize = 100;
        const results = [];

        for (let i = 0; i < recipients.length; i += batchSize) {
            const batch = recipients.slice(i, i + batchSize);
            const batchData = await Promise.all(batch.map(to => 
                resend.emails.send({
                    from: FROM_EMAIL,
                    to,
                    subject,
                    html
                })
            ));
            results.push(...batchData);
            
            // Subtle delay between batches to respect rate limits
            if (i + batchSize < recipients.length) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        return { success: true, count: recipients.length, results };
    } catch (error) {
        console.error('Broadcast Error:', error);
        return { success: false, error: error.message };
    }
};

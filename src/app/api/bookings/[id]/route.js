import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { NextResponse } from 'next/server';
import { logBookingStatusChanged } from '@/lib/discord';
import { sendTripCompletedNotification } from '@/lib/email-service';

import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Helper to verify auth
async function checkAuth(bookingId) {
    const session = await getServerSession(authOptions);
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    const driverToken = cookieStore.get('driver_token')?.value;

    // 1. Admin (Session or Token)
    let isAdmin = session?.user?.role === 'admin';
    if (!isAdmin && token) {
        try {
            const { verify } = await import('jsonwebtoken');
            const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET;
            const decoded = verify(token, secret);
            if (decoded.role === 'admin') isAdmin = true;
        } catch (e) { }
    }
    if (isAdmin) return { role: 'admin' };

    // 2. Driver (Token)
    if (driverToken) {
        try {
            const { verify } = await import('jsonwebtoken');
            const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'seranex_secret_key_12345';
            const decoded = verify(driverToken, secret);
            if (decoded.role === 'driver') {
                // Check if driver is assigned? (Ideally yes, but for now allow status update if role is driver)
                // We can refine this later if needed.
                return { role: 'driver', id: decoded.id };
            }
        } catch (e) { }
    }

    return null;
}

// PATCH - Update booking status
export async function PATCH(request, { params }) {
    try {
        await dbConnect();
        // Check Auth
        const auth = await checkAuth();
        if (!auth) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await request.json();
        const {
            status,
            changedBy,
            driverNotes,
            completedAt,
            assignedDriver
        } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Booking ID is required' },
                { status: 400 }
            );
        }

        // Valid status transitions
        const validStatuses = ['pending', 'confirmed', 'assigned', 'in-progress', 'completed', 'cancelled'];
        if (status && !validStatuses.includes(status)) {
            return NextResponse.json(
                { success: false, error: 'Invalid status' },
                { status: 400 }
            );
        }

        // Find existing booking
        const existingBooking = await Booking.findById(id);
        if (!existingBooking) {
            return NextResponse.json(
                { success: false, error: 'Booking not found' },
                { status: 404 }
            );
        }

        // Build update object
        const update = {};
        if (status) update.status = status;
        if (driverNotes) update.driverNotes = driverNotes;
        if (assignedDriver) update.driver = assignedDriver;
        if (status === 'completed') {
            update.completedAt = completedAt || new Date();
        }

        // Update the booking
        const booking = await Booking.findByIdAndUpdate(
            id,
            update,
            { new: true }
        );

        // Log to Discord
        await logBookingStatusChanged(booking, status, changedBy);

        // If completed, deduct commission and notify
        if (status === 'completed') {
            update.completedAt = completedAt || new Date();

            // --- COMMISSION LOGIC ---
            // 1. Get the driver assigned to this booking
            // Note: 'booking' variable currently holds the OLD doc before update if we use findByIdAndUpdate above immediately.
            // But we can use 'existingBooking' if driver didn't change, or 'assignedDriver' if passed.
            // Safest is to get the final state or use existing if not changing.

            const driverId = assignedDriver || existingBooking.driver;

            if (driverId) {
                const { default: Driver } = await import('@/models/Driver');
                const { default: Transaction } = await import('@/models/Transaction');

                const driverDoc = await Driver.findById(driverId);
                if (driverDoc) {
                    const commissionRate = 0.10; // 10%
                    const commissionAmount = Math.round(existingBooking.totalPrice * commissionRate);

                    // Deduct
                    driverDoc.walletBalance -= commissionAmount;
                    await driverDoc.save();

                    // Log Transaction
                    await Transaction.create({
                        driver: driverId,
                        type: 'debit',
                        amount: commissionAmount,
                        balanceAfter: driverDoc.walletBalance,
                        description: `Commission for Trip #${existingBooking._id.toString().slice(-6)}`,
                        referenceId: existingBooking._id,
                        status: 'completed',
                        performedBy: 'System'
                    });

                    console.log(`Commission deducted: ${commissionAmount} from Driver ${driverId}`);
                }
            }
            // ------------------------

            if (booking.customerEmail) {
                await sendTripCompletedNotification(booking);
            }
        }

        return NextResponse.json({
            success: true,
            booking,
            message: status === 'completed'
                ? 'Trip marked as completed. Customer has been notified.'
                : 'Booking status updated'
        });
    } catch (error) {
        console.error('Error updating booking status:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

// GET - Get single booking details
export async function GET(request, { params }) {
    try {
        await dbConnect();

        const { id } = await params;

        const booking = await Booking.findById(id).lean();

        if (!booking) {
            return NextResponse.json(
                { success: false, error: 'Booking not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            booking
        });
    } catch (error) {
        console.error('Error fetching booking:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export { PATCH as PUT };

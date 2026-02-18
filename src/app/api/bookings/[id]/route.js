import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { NextResponse } from 'next/server';
import { logBookingStatusChanged } from '@/lib/discord';
import Driver from '@/models/Driver';
import Transaction from '@/models/Transaction';
import { sendBookingStatusUpdate } from '@/lib/email-service';
import { isAdmin as checkAdmin } from '@/lib/admin-check';

import { cookies } from 'next/headers';

// Helper to verify auth
async function checkAuth(bookingId) {
    // 1. Robust Admin Check
    const isAdminUser = await checkAdmin();
    if (isAdminUser) {
        return { role: 'admin' };
    }

    // 2. Driver Check (Token)
    const cookieStore = await cookies();
    const driverToken = cookieStore.get('driver_token')?.value;

    if (driverToken) {
        try {
            const { verify } = await import('jsonwebtoken');
            const secret = process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || 'seranex_secret_key_12345';
            const decoded = verify(driverToken, secret);
            if (decoded.role === 'driver') {
                return { role: 'driver', id: decoded.id };
            }
        } catch (e) {
            console.log('[Auth] Driver token verification failed:', e.message);
        }
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
            console.log('[Auth] Unauthorized access attempt to update booking');
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

        // Update the booking and populate driver for email
        const booking = await Booking.findByIdAndUpdate(
            id,
            update,
            { new: true }
        ).populate('driver');

        // Log to Discord
        await logBookingStatusChanged(booking, status, changedBy);

        // If completed, deduct commission
        if (status === 'completed') {
            // --- COMMISSION LOGIC ---
            const driverId = booking.driver?._id || existingBooking.driver;

            if (driverId) {
                try {
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
                } catch (err) {
                    console.error('Error in commission logic:', err);
                }
            }
            // ------------------------
        }

        // Send Email Notification (Generic for all status changes)
        // If status changed and email exists
        if (status && status !== existingBooking.status && booking.customerEmail) {
            await sendBookingStatusUpdate(booking, status);
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

        const booking = await Booking.findById(id)
            .populate('driver', 'name phone vehicleNumber vehicleType vehicleModel ratings totalRides')
            .lean();

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

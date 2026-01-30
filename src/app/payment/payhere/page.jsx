import dbConnect from '@/lib/db';
import Booking from '@/models/Booking';
import { initiatePayHereTransaction } from '@/lib/payment';
import { redirect } from 'next/navigation';
import AutoSubmitForm from './AutoSubmitForm'; // Client component

export default async function PayHerePage({ searchParams }) {
    await dbConnect();
    const { bookingId } = searchParams;

    if (!bookingId) {
        return <div className="p-10 text-center text-red-600 font-bold">Invalid Booking ID</div>;
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
        return <div className="p-10 text-center text-red-600 font-bold">Booking Not Found</div>;
    }

    // Base URL for callbacks
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const returnUrl = `${baseUrl}/payment/success?bookingId=${booking._id}`;
    const cancelUrl = `${baseUrl}/payment/failed?bookingId=${booking._id}`;
    const notifyUrl = `${baseUrl}/api/payment/callback`; // PayHere server calls this in background

    const payHereData = initiatePayHereTransaction(booking, returnUrl, cancelUrl, notifyUrl);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-emerald-900 border-t-transparent rounded-full animate-spin"></div>
                <h2 className="text-xl font-bold text-emerald-900">Redirecting to Secure Payment...</h2>
                <p className="text-gray-500">Please do not close this window.</p>
            </div>

            <AutoSubmitForm
                url={payHereData.url}
                params={payHereData.params}
            />
        </div>
    );
}

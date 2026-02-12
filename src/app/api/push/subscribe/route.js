import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import dbConnect from '../../../../lib/db';
import User from '../../../../models/User';

export async function POST(request) {
    try {
        await dbConnect();
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const subscription = await request.json();

        // Update user with subscription
        // We use findOneAndUpdate to locate by email since session uses email
        await User.findOneAndUpdate(
            { email: session.user.email },
            { $set: { pushSubscription: subscription } }
        );

        return NextResponse.json({ message: 'Subscription saved' }, { status: 200 });
    } catch (error) {
        console.error('Push Subscription Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

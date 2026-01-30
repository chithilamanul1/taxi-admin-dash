import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const body = await req.json();
        const { amount, driverId, description } = body;

        // In a real scenario, we would sign these params with the Secret Key
        // and return a URL to the Sampath IPG or PayHere.

        // For Development/Demo: Redirect to our internal Mock Gateway
        // We pass data via URL params (INSECURE for production, but fine for mock)
        const mockUrl = `/payment/mock-gateway?amount=${amount}&driverId=${driverId}&ref=${Date.now()}`;

        return NextResponse.json({
            success: true,
            url: mockUrl
        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

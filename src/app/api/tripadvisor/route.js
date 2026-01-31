import { NextResponse } from 'next/server';
import { getTripAdvisorData, getTripAdvisorReviews } from '@/lib/tripadvisor';

export async function GET() {
    try {
        const reviews = await getTripAdvisorReviews();

        return NextResponse.json({ success: true, ...data, reviews });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

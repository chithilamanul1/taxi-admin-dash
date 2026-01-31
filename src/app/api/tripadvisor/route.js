import { NextResponse } from 'next/server';
import { getTripAdvisorData } from '@/lib/tripadvisor';

export async function GET() {
    try {
        const data = await getTripAdvisorData();

        if (!data) {
            return NextResponse.json(
                { success: false, error: 'Failed to fetch data' },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, ...data });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

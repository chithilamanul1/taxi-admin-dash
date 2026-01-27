import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';

export async function GET() {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;

    // Mask the URI for safety
    const maskedUri = uri
        ? uri.replace(/:\/\/([^:]+):([^@]+)@/, '://***:***@')
        : 'NOT_DEFINED';

    try {
        const start = Date.now();
        await dbConnect();
        const duration = Date.now() - start;

        const state = mongoose.connection.readyState;
        const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };

        return NextResponse.json({
            status: 'ok',
            database: states[state],
            latency: `${duration}ms`,
            env_check: {
                MONGODB_URI: maskedUri,
                NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT_DEFINED',
                JWT_SECRET: process.env.JWT_SECRET ? 'DEFINED' : 'MISSING',
            }
        });
    } catch (error) {
        return NextResponse.json({
            status: 'error',
            message: error.message,
            env_check: {
                MONGODB_URI: maskedUri,
            }
        }, { status: 500 });
    }
}

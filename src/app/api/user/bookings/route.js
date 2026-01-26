import { NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Booking from '@/models/Booking'

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const email = searchParams.get('email')

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        await dbConnect()

        // Find bookings by customer email
        const bookings = await Booking.find({
            $or: [
                { customerEmail: email },
                { 'customerEmail': email.toLowerCase() }
            ]
        }).sort({ createdAt: -1 })

        return NextResponse.json(bookings)
    } catch (error) {
        console.error('Error fetching user bookings:', error)
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
    }
}

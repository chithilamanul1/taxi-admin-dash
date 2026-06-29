import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Name, email, and password are required' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: 'Password must be at least 6 characters long' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { message: 'An account with this email already exists' },
                { status: 400 }
            );
        }

        // Create the user
        // Note: The User model has a pre('save') hook that hashes the password automatically using bcrypt
        const newUser = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            provider: 'credentials',
            role: 'user'
        });

        // Optional: Send welcome email here if needed

        return NextResponse.json(
            { message: 'User registered successfully', success: true },
            { status: 201 }
        );

    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json(
            { message: 'An error occurred during registration' },
            { status: 500 }
        );
    }
}

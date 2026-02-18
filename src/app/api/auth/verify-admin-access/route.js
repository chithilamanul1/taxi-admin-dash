import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(req) {
    try {
        await dbConnect();

        const adminAccounts = [
            { name: 'Primary Admin', email: 'admin@airporttaxis.lk', tempPass: 'Admin@123' },
            { name: 'Admin Alt', email: 'admin@airporttaxitours.lk', tempPass: 'Admin@123' },
            { name: 'Audit Boss', email: 'audit-boss@seranex.org', tempPass: 'Admin@123' },
            { name: 'Chithila', email: 'chithilamanul1@gmail.com', tempPass: 'Admin@123' }
        ];

        const results = [];

        for (const account of adminAccounts) {
            let user = await User.findOne({ email: account.email });

            if (user) {
                user.role = 'admin';
                user.isAdmin = true;
                user.password = account.tempPass; // Pre-save hook hashes this
                await user.save();
                results.push({ email: account.email, status: 'REPAIRED' });
            } else {
                await User.create({
                    name: account.name,
                    email: account.email,
                    password: account.tempPass,
                    role: 'admin',
                    isAdmin: true,
                    provider: 'credentials'
                });
                results.push({ email: account.email, status: 'CREATED' });
            }
        }

        return NextResponse.json({
            success: true,
            message: "Admin accounts repaired/created (including variations)",
            results
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

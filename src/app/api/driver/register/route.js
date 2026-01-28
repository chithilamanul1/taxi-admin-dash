import dbConnect from '@/lib/db';
import Driver from '@/models/Driver';
import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        await dbConnect();
        const data = await req.json();

        // 1. Basic Validation
        if (!data.phone || !data.nic || !data.vehicleNumber) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // 2. Check for existing driver
        const existingDriver = await Driver.findOne({
            $or: [{ phone: data.phone }, { nic: data.nic }]
        });

        if (existingDriver) {
            return NextResponse.json(
                { success: false, message: 'A driver with this Phone or NIC already exists.' },
                { status: 409 }
            );
        }

        // 3. Create Driver Record
        // In a real app, 'data.documents' keys would be S3/Cloudinary URLs here
        const newDriver = await Driver.create({
            ...data,
            name: data.name,
            phone: data.phone,
            email: data.email,
            nic: data.nic,
            address: data.address,

            vehicleType: data.vehicleType,
            vehicleModel: data.vehicleModel,
            vehicleNumber: data.vehicleNumber,
            vehicleYear: data.vehicleYear,

            bankDetails: {
                bankName: data.bankName,
                branch: data.branch,
                accountNumber: data.accountNumber,
                accountName: data.accountName
            },

            documents: data.documents, // Assuming frontend sends object with URL strings

            verificationStatus: 'pending', // Needs admin approval to become 'verified' and get a User account
            status: 'free',
            isOnline: false
        });

        return NextResponse.json({
            success: true,
            driverId: newDriver._id,
            message: 'Application submitted successfully'
        });

    } catch (error) {
        console.error('Driver Registration Error:', error);
        return NextResponse.json(
            { success: false, message: error.message || 'Server error' },
            { status: 500 }
        );
    }
}

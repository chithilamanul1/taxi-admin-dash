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
        const newDriver = await Driver.create({
            ...data,
            name: data.name || 'Unknown Driver',
            phone: data.phone,
            email: data.email || undefined,
            nic: data.nic,
            address: data.address || '',

            vehicleType: data.vehicleType || 'sedan',
            vehicleModel: data.vehicleModel || '',
            vehicleNumber: data.vehicleNumber,
            vehicleYear: data.vehicleYear || '',

            bankDetails: {
                bankName: data.bankName || '',
                branch: data.branch || '',
                accountNumber: data.accountNumber || '',
                accountName: data.accountName || ''
            },

            // Ensure documents are saved even if they come in a flat structure or nested
            documents: {
                licenseFront: data.documents?.licenseFront || data.licenseFront || '',
                licenseBack: data.documents?.licenseBack || data.licenseBack || '',
                nicFront: data.documents?.nicFront || data.nicFront || '',
                nicBack: data.documents?.nicBack || data.nicBack || '',
                vehicleFront: data.documents?.vehicleFront || data.vehicleFront || '',
                vehicleBack: data.documents?.vehicleBack || data.vehicleBack || '',
                depositReceipt: data.documents?.depositReceipt || data.depositReceipt || '',
            },

            verificationStatus: 'pending',
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

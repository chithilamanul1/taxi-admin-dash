import dbConnect from '@/lib/db';
import Pricing from '@/models/Pricing';
import { NextResponse } from 'next/server';

export async function PUT(request, { params }) {
    try {
        await dbConnect();
        const { type } = params;
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category') || 'airport-transfer';
        const data = await request.json();

        // Update the pricing document where vehicleType and category matches
        const updatedPricing = await Pricing.findOneAndUpdate(
            { vehicleType: type, category: category },
            data,
            { new: true, runValidators: true }
        );

        if (!updatedPricing) {
            return NextResponse.json({ message: 'Pricing not found' }, { status: 404 });
        }

        return NextResponse.json(updatedPricing);
    } catch (error) {
        console.error('Error updating pricing:', error);
        return NextResponse.json({ message: 'Failed to update pricing', error: error.message }, { status: 400 });
    }
}

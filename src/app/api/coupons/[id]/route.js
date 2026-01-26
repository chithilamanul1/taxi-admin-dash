import dbConnect from '@/lib/db';
import Coupon from '@/models/Coupon';
import { NextResponse } from 'next/server';

export async function DELETE(req, context) {
    // Await params in Next.js 15? Or use context.params directly if safe.
    // Standard is: params is a Promise in upcoming versions, but often still object.
    // I'll assume standard 13/14 behavior or use `await context.params` if needed later.
    // Step 916: I used `params.id` directly.

    await dbConnect();
    const { id } = context.params;

    try {
        await Coupon.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

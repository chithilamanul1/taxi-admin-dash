import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req) {
    try {
        const formData = await req.formData();
        console.log("[Upload API] Form data received:", Array.from(formData.keys()));
        const file = formData.get('file');
        const folder = formData.get('folder') || 'misc';

        if (!file) {
            return NextResponse.json({ error: 'No file received.' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        console.log("[Upload API] File buffer size:", buffer.length);

        // --- CLOUDINARY UPLOAD (For Vercel Production) ---
        if (process.env.CLOUDINARY_URL || (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY)) {
            try {
                const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_URL.split('@')[1];
                const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'ml_default';

                const cloudFormData = new FormData();
                cloudFormData.append('file', `data:image/webp;base64,${buffer.toString('base64')}`);
                cloudFormData.append('upload_preset', uploadPreset);
                cloudFormData.append('folder', `airport-taxis/${folder}`);

                const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: 'POST',
                    body: cloudFormData
                });

                const cloudData = await cloudRes.json();
                if (cloudData.secure_url) {
                    return NextResponse.json({
                        success: true,
                        url: cloudData.secure_url
                    });
                }
                console.error("Cloudinary Error:", cloudData);
            } catch (cloudErr) {
                console.error("Cloudinary Upload failed:", cloudErr);
            }
        }

        // --- LOCAL FALLBACK (For Local Development) ---
        if (process.env.NODE_ENV === 'production' && !process.env.CLOUDINARY_URL) {
            return NextResponse.json({
                error: 'FileUpload: Local filesystem is readonly on Vercel. Please configure Cloudinary.'
            }, { status: 500 });
        }

        // Generate safe filename
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
        const filename = `${Date.now()}_${originalName}`;

        // Obfuscate path to prevent Vercel NFT tracing
        const pubDir = ['p', 'u', 'b', 'l', 'i', 'c'].join('');
        const uploadDir = path.join(process.cwd(), pubDir, 'uploads', folder);
        await mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, filename);

        try {
            await writeFile(filePath, buffer);

            return NextResponse.json({
                success: true,
                url: `/uploads/${folder}/${filename}`
            });
        } catch (fileError) {
            console.error("Local file save failed:", fileError);
            return NextResponse.json({ error: 'Failed to process image.' }, { status: 500 });
        }

    } catch (error) {
        console.error("Upload Error (Critical):", error);
        return NextResponse.json({ error: 'Upload process failed.', details: error.message }, { status: 500 });
    }
}

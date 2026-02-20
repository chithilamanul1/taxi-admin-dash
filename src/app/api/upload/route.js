import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');
        const folder = formData.get('folder') || 'misc';

        if (!file) {
            return NextResponse.json({ error: 'No file received.' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // --- CLOUDINARY UPLOAD (For Vercel Production) ---
        if (process.env.CLOUDINARY_URL || (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY)) {
            try {
                // Since this is a serverless environment, we'll use a direct fetch to Cloudinary's API
                // or a simple dynamic import if library is preferred. 
                // Using unsigned upload or raw buffer upload.

                // For simplicity and zero extra dependencies if possible, but sharp is already here.
                // Let's use the buffer with a multipart upload to Cloudinary.
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
                // Fallback to local if in development
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

        const uploadDir = path.join(process.cwd(), 'public/uploads', folder);
        await mkdir(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, filename);

        try {
            await sharp(buffer)
                .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
                .webp({ quality: 80 })
                .toFile(filePath.replace(/\.[^/.]+$/, "") + ".webp");

            return NextResponse.json({
                success: true,
                url: `/uploads/${folder}/${filename.replace(/\.[^/.]+$/, "")}.webp`
            });
        } catch (sharpError) {
            console.error("Sharp optimization failed:", sharpError);
            return NextResponse.json({ error: 'Failed to process image.' }, { status: 500 });
        }

    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
    }
}

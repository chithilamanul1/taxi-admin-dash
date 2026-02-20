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

        // --- CUSTOM EXPRESS API UPLOAD ---
        // This bypasses Vercel's readonly FS and Cloudinary limits
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

        try {
            const backendFormData = new FormData();
            backendFormData.append('file', file);
            backendFormData.append('folder', folder);

            const backendRes = await fetch(`${backendUrl}/api/upload`, {
                method: 'POST',
                body: backendFormData
            });

            if (backendRes.ok) {
                const data = await backendRes.json();
                if (data.success) {
                    return NextResponse.json({
                        success: true,
                        url: data.url
                    });
                }
            }
            const errorText = await backendRes.text();
            console.error("Backend Upload Error:", errorText);
        } catch (backendErr) {
            console.error("Backend Connection failed:", backendErr.message);
        }

        // --- LOCAL FALLBACK (Only for Local Dev) ---
        if (process.env.NODE_ENV === 'development') {
            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
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
                console.error("Local fallback failed:", sharpError);
            }
        }

        return NextResponse.json({
            error: 'Upload service unavailable. Please check if the Custom API Server is running.'
        }, { status: 503 });

    } catch (error) {
        console.error("Upload Route Error:", error);
        return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
    }
}

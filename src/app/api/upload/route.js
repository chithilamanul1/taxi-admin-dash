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
        const folder = formData.get('folder') || 'misc'; // Default to 'misc' if no folder provided

        if (!file) {
            return NextResponse.json({ error: 'No file received.' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // Generate safe filename
        const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
        const filename = `${Date.now()}_${originalName}`;

        // Define upload directory
        const uploadDir = path.join(process.cwd(), 'public/uploads', folder);
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, filename);

        // Optimize and save image using sharp
        try {
            await sharp(buffer)
                .resize(1200, 1200, { // Reasonable max size
                    fit: 'inside', // Maintain aspect ratio
                    withoutEnlargement: true
                })
                .webp({ quality: 80 }) // Convert to WebP for performance
                .toFile(filePath.replace(/\.[^/.]+$/, "") + ".webp"); // Ensure extension is .webp

            return NextResponse.json({
                success: true,
                url: `/uploads/${folder}/${filename.replace(/\.[^/.]+$/, "")}.webp`
            });
        } catch (sharpError) {
            console.error("Sharp optimization failed, falling back to raw save:", sharpError);
            // Fallback: Save original file if optimization fails (e.g. not an image)
            // But for this use case, we primarily want images.
            // If it fails, it might be a corrupted image or non-image.
            return NextResponse.json({ error: 'Failed to process image.' }, { status: 500 });
        }

    } catch (error) {
        console.error("Upload Error:", error);
        return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
    }
}

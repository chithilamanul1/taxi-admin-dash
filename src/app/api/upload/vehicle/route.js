import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const vehicleType = formData.get('vehicleType');

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create vehicles directory if it doesn't exist
        const uploadDir = path.join(process.cwd(), 'public', 'vehicles');
        await mkdir(uploadDir, { recursive: true });

        // Generate filename
        const originalName = file.name;
        const ext = path.extname(originalName);
        const baseName = vehicleType || path.basename(originalName, ext);
        const filename = `${baseName.toLowerCase().replace(/\s+/g, '-')}${ext}`;
        const filepath = path.join(uploadDir, filename);

        // Process image with sharp - resize and optimize
        const processedBuffer = await sharp(buffer)
            .resize(800, 600, {
                fit: 'contain',
                background: { r: 255, g: 255, b: 255, alpha: 0 }
            })
            .jpeg({ quality: 85 })
            .toBuffer();

        // Save processed image
        await writeFile(filepath.replace(ext, '.jpg'), processedBuffer);

        const publicPath = `/vehicles/${baseName.toLowerCase().replace(/\s+/g, '-')}.jpg`;

        return NextResponse.json({
            success: true,
            path: publicPath,
            message: 'Image uploaded and optimized successfully'
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({
            error: 'Upload failed',
            details: error.message
        }, { status: 500 });
    }
}

export const config = {
    api: {
        bodyParser: false,
    },
};

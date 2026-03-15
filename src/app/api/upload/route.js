import { NextResponse } from 'next/server';
import cloudinary from 'cloudinary';

// Use CLOUDINARY_URL if available for easier environment management, otherwise use individual parts
if (process.env.CLOUDINARY_URL) {
    cloudinary.v2.config({
        cloudinary_url: process.env.CLOUDINARY_URL
    });
} else {
    cloudinary.v2.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
}

export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('file');
        const folder = formData.get('folder') || 'general';

        if (!file) {
            return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.v2.uploader.upload_stream(
                {
                    folder: folder,
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        return NextResponse.json({
            success: true,
            url: result.secure_url,
            secure_url: result.secure_url,
            public_id: result.public_id,
        });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

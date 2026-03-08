import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import { isAdmin } from '@/lib/admin-check';

export async function GET(req) {
    try {
        await dbConnect();
        const posts = await Post.find({}).sort({ createdAt: -1 });

        // Add CORS headers for FlutterFlow
        const response = NextResponse.json({ success: true, data: posts });
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        return response;
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const data = await req.json();

        // Basic validation
        if (!data.title || !data.content || !data.imageUrl) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        // Auto-generate slug if not provided
        if (!data.slug) {
            data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }

        const post = await Post.create(data);
        return NextResponse.json({ success: true, data: post }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function OPTIONS() {
    const response = new NextResponse(null, { status: 204 });
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return response;
}

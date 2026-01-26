import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Post from '../../../models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';

// Helper to generate slug
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
};

export async function GET(req) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const isAdmin = searchParams.get('isAdmin') === 'true';

        const query = isAdmin ? {} : { isPublished: true };

        const posts = await Post.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Post.countDocuments(query);

        return NextResponse.json({
            success: true,
            data: posts,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) { // Ideally check for admin role here
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();

        // Generate slug if not provided, or ensure provided one is unique
        let slug = body.slug || generateSlug(body.title);

        // Ensure unique slug
        let uniqueSlug = slug;
        let counter = 1;
        while (await Post.exists({ slug: uniqueSlug })) {
            uniqueSlug = `${slug}-${counter}`;
            counter++;
            // Safety break
            if (counter > 100) {
                uniqueSlug = `${slug}-${Date.now()}`;
                break;
            }
        }
        body.slug = uniqueSlug;

        const post = await Post.create(body);
        return NextResponse.json({ success: true, data: post }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Post from '../../../../models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

export async function GET(req, { params }) {
    try {
        await dbConnect();
        const post = await Post.findOne({ slug: params.slug });

        if (!post) {
            return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: post });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();

        const post = await Post.findOneAndUpdate(
            { slug: params.slug },
            body,
            { new: true, runValidators: true }
        );

        if (!post) {
            return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: post });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(req, { params }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const post = await Post.findOneAndDelete({ slug: params.slug });

        if (!post) {
            return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

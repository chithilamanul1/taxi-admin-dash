import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Post from '../../../../models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

async function findPost(slug) {
    const mongoose = require('mongoose');
    const isId = mongoose.Types.ObjectId.isValid(slug);
    if (isId) {
        return await Post.findById(slug);
    }
    return await Post.findOne({ slug });
}

export async function GET(req, { params }) {
    try {
        await dbConnect();
        const post = await findPost(params.slug);

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

        // Check if params.slug is an ID or a slug
        const mongoose = require('mongoose');
        const isId = mongoose.Types.ObjectId.isValid(params.slug);
        const query = isId ? { _id: params.slug } : { slug: params.slug };

        // Normalize slug if provided in body
        if (body.slug) {
            body.slug = body.slug
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
        }

        const post = await Post.findOneAndUpdate(
            query,
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
        const mongoose = require('mongoose');
        const isId = mongoose.Types.ObjectId.isValid(params.slug);
        const query = isId ? { _id: params.slug } : { slug: params.slug };

        const post = await Post.findOneAndDelete(query);

        if (!post) {
            return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

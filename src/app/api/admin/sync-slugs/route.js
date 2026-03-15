import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Post from '../../../../models/Post';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';

const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
};

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const posts = await Post.find({});
        let updatedCount = 0;

        for (const post of posts) {
            const currentSlug = post.slug;
            const normalizedSlug = generateSlug(post.slug || post.title);
            
            if (currentSlug !== normalizedSlug) {
                // Check if this new slug already exists for another post
                const slugExists = await Post.findOne({ slug: normalizedSlug, _id: { $ne: post._id } });
                let finalSlug = normalizedSlug;
                
                if (slugExists) {
                    finalSlug = `${normalizedSlug}-${Date.now()}`;
                }

                post.slug = finalSlug;
                await post.save();
                updatedCount++;
            }
        }

        return NextResponse.json({ 
            success: true, 
            message: `Successfully synchronized ${updatedCount} blog slugs.`,
            count: updatedCount
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

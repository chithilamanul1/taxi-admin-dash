import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Post from '@/models/Post';
import { seoBlogPosts } from '@/data/seo-blog-posts';

export async function GET() {
    try {
        await dbConnect();

        let createdCount = 0;
        let errors = [];

        for (const post of seoBlogPosts) {
            try {
                // Check if post exists by slug
                const existingPost = await Post.findOne({ slug: post.slug });

                if (!existingPost) {
                    await Post.create(post);
                    createdCount++;
                }
            } catch (err) {
                console.error(`Error seeding post ${post.title}:`, err);
                errors.push({ title: post.title, error: err.message });
            }
        }

        return NextResponse.json({
            success: true,
            message: `Seeded ${createdCount} new blog posts.`,
            totalProcessed: seoBlogPosts.length,
            errors: errors.length > 0 ? errors : undefined
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

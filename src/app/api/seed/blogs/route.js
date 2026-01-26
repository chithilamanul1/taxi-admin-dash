import dbConnect from '@/lib/db';
import BlogPost from '@/models/Post';
import { NextResponse } from 'next/server';
import { seoBlogPosts } from '@/data/seo-blog-posts';

/**
 * POST /api/seed/blogs
 * Seeds the database with SEO-optimized blog posts
 */
export async function POST(request) {
    try {
        await dbConnect();

        // Clear existing posts (optional - be careful in production)
        // await BlogPost.deleteMany({});

        const results = [];

        for (const post of seoBlogPosts) {
            // Check if post already exists by slug
            const existing = await BlogPost.findOne({ slug: post.slug });

            if (existing) {
                results.push({ slug: post.slug, status: 'exists' });
                continue;
            }

            // Create new post
            const newPost = await BlogPost.create({
                title: post.title,
                slug: post.slug,
                content: post.content,
                excerpt: post.excerpt,
                coverImage: post.coverImage,
                isPublished: post.isPublished,
                seo: post.seo,
                tags: post.tags,
                author: 'Airport Taxis Team',
                publishedAt: new Date(),
            });

            results.push({ slug: post.slug, status: 'created', id: newPost._id });
        }

        return NextResponse.json({
            success: true,
            message: `Processed ${results.length} blog posts`,
            results
        });

    } catch (error) {
        console.error('Blog seeding error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    return NextResponse.json({
        message: "POST to this endpoint to seed SEO blog posts",
        totalPosts: seoBlogPosts.length,
        posts: seoBlogPosts.map(p => ({ title: p.title, slug: p.slug }))
    });
}

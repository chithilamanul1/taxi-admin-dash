import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/Post';
import { runSEOPipeline } from '@/lib/seo-pipeline';

export async function POST(req) {
    try {
        if (!process.env.OPENROUTER_API_KEY) {
            return NextResponse.json({ success: false, error: 'OPENROUTER_API_KEY not configured' }, { status: 500 });
        }

        await dbConnect();
        const { keyword } = await req.json();

        if (!keyword?.trim()) {
            return NextResponse.json({ success: false, error: 'keyword is required' }, { status: 400 });
        }

        // Check for existing post to avoid duplicates
        const slug = keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        const exists = await BlogPost.findOne({ slug });
        if (exists) {
            return NextResponse.json(
                { success: false, error: `Post already exists for this keyword: /blog/${exists.slug}` },
                { status: 409 }
            );
        }

        const result = await runSEOPipeline(keyword.trim());
        return NextResponse.json(result);

    } catch (err) {
        console.error('[SEO Pipeline Route] Error:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

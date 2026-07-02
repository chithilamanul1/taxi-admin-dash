import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/Post';
import { runSEOPipeline } from '@/lib/seo-pipeline';

export async function POST(req) {
    try {
        const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
        if (!OPENROUTER_API_KEY) {
            return NextResponse.json({ success: false, error: 'OPENROUTER_API_KEY not configured.' }, { status: 500 });
        }

        await dbConnect();
        const { keywords } = await req.json();

        if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
            return NextResponse.json({ success: false, error: 'keywords array is required' }, { status: 400 });
        }

        const keywordsToProcess = keywords.slice(0, 20);
        const results = [];
        const errors = [];

        for (const keyword of keywordsToProcess) {
            try {
                // Check for duplicates
                const slug = keyword.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                const existing = await BlogPost.findOne({ slug });
                if (existing) {
                    results.push({ keyword, status: 'skipped', reason: 'already exists', slug });
                    continue;
                }

                console.log(`[SEO Bulk] Running pipeline for: "${keyword}"`);
                const result = await runSEOPipeline(keyword);
                results.push({ keyword, status: 'success', slug: result.slug, title: result.title, wordCount: result.wordCount });

            } catch (err) {
                console.error(`[SEO Bulk] Failed for "${keyword}":`, err.message);
                errors.push({ keyword, error: err.message });
            }

            // Pause between calls to respect API rate limits
            await new Promise(r => setTimeout(r, 1500));
        }

        return NextResponse.json({
            success: true,
            generated: results.filter(r => r.status === 'success').length,
            skipped: results.filter(r => r.status === 'skipped').length,
            failed: errors.length,
            results,
            errors
        });

    } catch (err) {
        console.error('[SEO Bulk] Fatal:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

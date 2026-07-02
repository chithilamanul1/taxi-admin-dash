import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/Post';
import { ALL_SEO_KEYWORDS } from '@/lib/seo-keywords';
import { runSEOPipeline } from '@/lib/seo-pipeline';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const cronSecret = process.env.SEO_CRON_SECRET || 'airporttaxis-seo-secret';
    if (token !== cronSecret) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return runScheduler();
}

export async function POST(req) {
    return runScheduler();
}

async function runScheduler() {
    try {
        const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
        if (!OPENROUTER_API_KEY) {
            return NextResponse.json({ success: false, error: 'OPENROUTER_API_KEY not configured' }, { status: 500 });
        }

        await dbConnect();

        const posts = await BlogPost.find({ isPublished: true }, 'title slug seo tags').lean();
        const allPostText = posts.map(p =>
            `${p.title} ${p.slug} ${(p.seo?.keywords || []).join(' ')} ${(p.tags || []).join(' ')}`
        ).join(' ').toLowerCase();

        // Find first uncovered keyword
        let targetKeyword = null;
        for (const kw of ALL_SEO_KEYWORDS) {
            const words = kw.toLowerCase().split(' ');
            const isCovered = words.every(w => allPostText.includes(w));
            if (!isCovered) {
                targetKeyword = kw;
                break;
            }
        }

        if (!targetKeyword) {
            return NextResponse.json({
                success: true,
                message: '🎉 All keywords covered! No post needed.',
                allCovered: true
            });
        }

        console.log(`[SEO Scheduler] Running full pipeline for: "${targetKeyword}"`);
        const result = await runSEOPipeline(targetKeyword);

        return NextResponse.json({
            success: true,
            keyword: targetKeyword,
            title: result.title,
            slug: result.slug,
            wordCount: result.wordCount,
            serpSkipped: result.serpSkipped,
            message: `✅ Daily pipeline post published: "${result.title}" (~${result.wordCount} words)`
        });

    } catch (err) {
        console.error('[SEO Scheduler] Error:', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

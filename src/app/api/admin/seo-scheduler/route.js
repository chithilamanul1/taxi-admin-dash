import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/Post';
import { ALL_SEO_KEYWORDS } from '@/lib/seo-keywords';
import { runSEOPipeline, notifyDiscord, pingSearchEngines } from '@/lib/seo-pipeline';

const SITE_URL = 'https://airporttaxis.lk';

export async function GET(req) {
    // Vercel Cron calls this as GET with an Authorization header
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.SEO_CRON_SECRET;
    if (!cronSecret) {
        return NextResponse.json({ success: false, message: 'SEO_CRON_SECRET is not configured' }, { status: 500 });
    }
    if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return runScheduler();
}

export async function POST() {
    // Admin panel "Run Now" button
    return runScheduler();
}

async function runScheduler() {
    const startTime = Date.now();

    try {
        if (!process.env.OPENROUTER_API_KEY) {
            await notifyDiscord({
                embeds: [{
                    title: 'SEO Engine Error',
                    description: '`OPENROUTER_API_KEY` is not configured on the server.',
                    color: 0xFF0000,
                    footer: { text: 'Airport Taxis SEO Engine' }
                }]
            });
            return NextResponse.json({ success: false, error: 'OPENROUTER_API_KEY not configured' }, { status: 500 });
        }

        await dbConnect();

        // Find next uncovered keyword
        const posts = await BlogPost.find({ isPublished: true }, 'title slug seo tags').lean();
        const allPostText = posts.map(p =>
            `${p.title} ${p.slug} ${(p.seo?.keywords || []).join(' ')} ${(p.tags || []).join(' ')}`
        ).join(' ').toLowerCase();

        let targetKeyword = null;
        for (const kw of ALL_SEO_KEYWORDS) {
            const words = kw.toLowerCase().split(' ');
            if (!words.every(w => allPostText.includes(w))) {
                targetKeyword = kw;
                break;
            }
        }

        if (!targetKeyword) {
            await notifyDiscord({
                embeds: [{
                    title: 'SEO Engine - All Keywords Covered!',
                    description: 'Every keyword in the database already has blog coverage. No post generated today.',
                    color: 0x00FF88,
                    fields: [
                        { name: 'Total Posts', value: `${posts.length}`, inline: true },
                        { name: 'Total Keywords', value: `${ALL_SEO_KEYWORDS.length}`, inline: true }
                    ],
                    footer: { text: 'Airport Taxis SEO Engine' },
                    timestamp: new Date().toISOString()
                }]
            });
            return NextResponse.json({
                success: true,
                message: 'All keywords covered! No post needed.',
                allCovered: true
            });
        }

        // Notify Discord that pipeline is starting
        await notifyDiscord({
            embeds: [{
                title: 'SEO Pipeline Starting...',
                description: `Running 4-phase pipeline for keyword:\n\`${targetKeyword}\``,
                color: 0xF59E0B,
                fields: [
                    { name: 'Phase 1', value: 'SerpApi - SERP Research', inline: true },
                    { name: 'Phase 2', value: 'Llama 3.3 70B - Strategy', inline: true },
                    { name: 'Phase 3', value: 'Llama 3.3 70B - Writing', inline: true }
                ],
                footer: { text: 'Airport Taxis SEO Engine (Free Tier)' },
                timestamp: new Date().toISOString()
            }]
        });

        console.log(`[SEO Scheduler] Running full pipeline for: "${targetKeyword}"`);
        const result = await runSEOPipeline(targetKeyword);

        // Immediately ping Google, Bing & IndexNow so they crawl within hours
        await pingSearchEngines(result.slug);


        const elapsed = Math.round((Date.now() - startTime) / 1000);
        const coveredCount = posts.length + 1;
        const totalKeywords = ALL_SEO_KEYWORDS.length;
        const coveragePct = Math.round((coveredCount / totalKeywords) * 100);

        // Discord success notification
        await notifyDiscord({
            embeds: [{
                title: 'New SEO Blog Post Published!',
                url: `${SITE_URL}/blog/${result.slug}`,
                description: `**${result.title}**\n\nA new SEO-optimized blog post has been automatically published to airporttaxis.lk`,
                color: 0x00C851,
                fields: [
                    { name: 'Keyword Targeted', value: `\`${targetKeyword}\``, inline: false },
                    { name: 'Word Count', value: `~${result.wordCount.toLocaleString()} words`, inline: true },
                    { name: 'Pipeline Time', value: `${elapsed}s`, inline: true },
                    { name: 'SERP Research', value: result.serpSkipped ? 'Skipped (no API key)' : 'Completed', inline: true },
                    { name: 'Keyword Coverage', value: `${coveredCount}/${totalKeywords} (${coveragePct}%)`, inline: true },
                    { name: 'Live URL', value: `[View Post](${SITE_URL}/blog/${result.slug})`, inline: true },
                    { name: 'Admin Blog Panel', value: `[Manage Posts](${SITE_URL}/admin)`, inline: true }
                ],
                thumbnail: { url: `${SITE_URL}/logo.png` },
                footer: { text: 'Airport Taxis AI SEO Engine - Daily Auto-Post' },
                timestamp: new Date().toISOString()
            }]
        });

        return NextResponse.json({
            success: true,
            keyword: targetKeyword,
            title: result.title,
            slug: result.slug,
            wordCount: result.wordCount,
            serpSkipped: result.serpSkipped,
            elapsedSeconds: elapsed,
            message: `Published: "${result.title}" (~${result.wordCount} words) in ${elapsed}s`
        });

    } catch (err) {
        const elapsed = Math.round((Date.now() - startTime) / 1000);
        console.error('[SEO Scheduler] Error:', err);

        // Discord error notification
        await notifyDiscord({
            embeds: [{
                title: 'SEO Engine Error',
                description: `The daily SEO pipeline failed after ${elapsed}s.`,
                color: 0xFF0000,
                fields: [
                    { name: 'Error', value: `\`\`\`${err.message?.slice(0, 500)}\`\`\`` }
                ],
                footer: { text: 'Airport Taxis SEO Engine' },
                timestamp: new Date().toISOString()
            }]
        });

        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import { SEO_KEYWORD_CLUSTERS, ALL_SEO_KEYWORDS } from '@/lib/seo-keywords';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/Post';

export async function GET(req) {
    try {
        await dbConnect();

        // Get all published blog posts to compute keyword coverage
        const posts = await BlogPost.find({ isPublished: true }, 'title seo tags slug').lean();

        const allPostText = posts.map(p =>
            `${p.title} ${p.slug} ${(p.seo?.keywords || []).join(' ')} ${(p.tags || []).join(' ')}`
        ).join(' ').toLowerCase();

        // Compute coverage for each keyword
        const clustersWithCoverage = SEO_KEYWORD_CLUSTERS.map(cluster => ({
            ...cluster,
            keywords: cluster.keywords.map(kw => {
                const words = kw.toLowerCase().split(' ');
                const isCovered = words.every(w => allPostText.includes(w));
                return { keyword: kw, covered: isCovered };
            })
        }));

        const totalKeywords = ALL_SEO_KEYWORDS.length;
        const coveredKeywords = clustersWithCoverage.flatMap(c => c.keywords).filter(k => k.covered).length;

        return NextResponse.json({
            success: true,
            clusters: clustersWithCoverage,
            stats: {
                totalKeywords,
                coveredKeywords,
                uncoveredKeywords: totalKeywords - coveredKeywords,
                coveragePercent: Math.round((coveredKeywords / totalKeywords) * 100),
                totalPosts: posts.length,
            }
        });
    } catch (err) {
        console.error('[SEO Keywords API]', err);
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

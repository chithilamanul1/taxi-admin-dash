/**
 * SEO Pipeline Library — 4-Phase Multi-Model Content Engine
 * 
 * Phase 1: SERP Research (SerpApi)     — Real Google Sri Lanka data
 * Phase 2: Content Strategy (DeepSeek R1) — Gap analysis + content brief
 * Phase 3: Content Writing (Claude 3.5 Sonnet) — 1400+ word article
 * Phase 4: CMS Publish (MongoDB + Next.js) — Instant publish
 */

import dbConnect from '@/lib/db';
import BlogPost from '@/models/Post';
import { revalidatePath } from 'next/cache';

// ─────────────────────────────────────────────
// PHASE 1: SERP Research
// ─────────────────────────────────────────────
async function phase1_serpResearch(keyword) {
    const SERPAPI_KEY = process.env.SERPAPI_KEY;

    if (!SERPAPI_KEY) {
        console.warn('[SEO Pipeline Phase 1] No SERPAPI_KEY — skipping SERP research');
        return { keyword, topResults: [], peopleAlsoAsk: [], relatedSearches: [], serpSkipped: true };
    }

    try {
        const url = new URL('https://serpapi.com/search');
        url.searchParams.set('q', keyword);
        url.searchParams.set('location', 'Sri Lanka');
        url.searchParams.set('gl', 'lk');
        url.searchParams.set('hl', 'en');
        url.searchParams.set('num', '5');
        url.searchParams.set('api_key', SERPAPI_KEY);

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error(`SerpApi error: ${res.status}`);
        const data = await res.json();

        const topResults = (data.organic_results || []).slice(0, 5).map(r => ({
            title: r.title,
            snippet: r.snippet,
            link: r.link
        }));
        const peopleAlsoAsk = (data.related_questions || []).slice(0, 5).map(q => ({
            question: q.question,
            snippet: q.snippet
        }));
        const relatedSearches = (data.related_searches || []).slice(0, 8).map(r => r.query);

        console.log(`[Phase 1] SERP: ${topResults.length} results, ${peopleAlsoAsk.length} PAA, ${relatedSearches.length} related`);
        return { keyword, topResults, peopleAlsoAsk, relatedSearches, serpSkipped: false };

    } catch (err) {
        console.error('[Phase 1] SERP failed:', err.message);
        return { keyword, topResults: [], peopleAlsoAsk: [], relatedSearches: [], serpSkipped: true };
    }
}

// ─────────────────────────────────────────────
// PHASE 2: Content Strategy (DeepSeek R1)
// ─────────────────────────────────────────────
async function phase2_contentStrategy(serpData) {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    const { keyword, topResults, peopleAlsoAsk, relatedSearches } = serpData;

    const prompt = `You are a senior SEO content strategist. Create a detailed content brief to rank #1 on Google Sri Lanka for: "${keyword}".

COMPETITOR ANALYSIS:
${topResults.length > 0
        ? topResults.map((r, i) => `${i + 1}. "${r.title}" — ${r.snippet}`).join('\n')
        : '(No competitor data — analyze based on keyword intent)'
    }

PEOPLE ALSO ASK:
${peopleAlsoAsk.length > 0
        ? peopleAlsoAsk.map(q => `- ${q.question}`).join('\n')
        : '(Infer likely questions from keyword)'
    }

RELATED SEARCHES: ${relatedSearches.length > 0 ? relatedSearches.join(', ') : 'N/A'}

Return ONLY raw JSON (no markdown fences):
{
  "primaryKeyword": "${keyword}",
  "targetIntent": "informational|transactional|navigational",
  "wordCountTarget": 1400,
  "contentAngle": "The unique angle that beats competitors",
  "h1Title": "SEO H1 (55-60 chars, includes keyword)",
  "metaTitle": "Under 60 chars — keyword + brand",
  "metaDescription": "Under 160 chars — keyword + benefit + CTA",
  "outline": [
    { "heading": "H2 heading", "purpose": "what this covers", "keyPoints": ["point 1", "point 2"] }
  ],
  "lsiKeywords": ["5-8 related keywords"],
  "faqQuestions": ["4-5 FAQ questions"],
  "imageSearchQuery": "2-3 word Unsplash query",
  "internalLinkSuggestions": ["pages on airporttaxis.lk to link to"],
  "slug": "url-slug"
}`;

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://airporttaxis.lk',
            'X-Title': 'Airport Taxi Tours SEO Pipeline — Strategy'
        },
        body: JSON.stringify({
            model: 'deepseek/deepseek-r1',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: 'json_object' },
            max_tokens: 2000
        })
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`[Phase 2] DeepSeek error ${res.status}: ${err}`);
    }

    const data = await res.json();
    const raw = data.choices[0].message.content;
    const brief = JSON.parse(raw.replace(/```json\n?|```/g, '').trim());
    console.log(`[Phase 2] Brief created: "${brief.h1Title}"`);
    return brief;
}

// ─────────────────────────────────────────────
// PHASE 3: Content Writing (Claude 3.5 Sonnet)
// ─────────────────────────────────────────────
async function phase3_writeContent(brief) {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

    const outlineText = (brief.outline || []).map((s, i) =>
        `${i + 1}. ## ${s.heading}\n   Purpose: ${s.purpose}\n   Key Points: ${(s.keyPoints || []).join(', ')}`
    ).join('\n\n');

    const prompt = `You are an expert travel content writer for Airport Taxi Tours (airporttaxis.lk), Sri Lanka's #1 private driver and tour service.

Write a comprehensive 1400+ word blog post in Markdown based on this brief:

PRIMARY KEYWORD: "${brief.primaryKeyword}"
H1 TITLE: ${brief.h1Title}
CONTENT ANGLE: ${brief.contentAngle}
LSI KEYWORDS: ${(brief.lsiKeywords || []).join(', ')}

OUTLINE:
${outlineText}

FAQ QUESTIONS:
${(brief.faqQuestions || []).map((q, i) => `FAQ ${i + 1}: ${q}`).join('\n')}

INTERNAL LINKS TO ADD:
${(brief.internalLinkSuggestions || []).map(l => `- ${l}`).join('\n')}

RULES:
1. Start with "## [first H2]" — do NOT include H1
2. Minimum 1400 words
3. Weave in ALL LSI keywords naturally
4. Include real Sri Lanka facts: place names, distances (km), journey times, price ranges (LKR)
5. Each H2 must be at least 150 words
6. Answer all FAQ questions in a dedicated "## Frequently Asked Questions" section
7. End with: "Ready to book? Visit airporttaxis.lk for instant online booking with fixed rates, 24/7 service, and professional English-speaking drivers."
8. Use bullet points, numbered lists, and **bold text** for scannable reading
9. DO NOT mention competitor brands

Return ONLY raw Markdown — no JSON wrapper, no code fences.`;

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://airporttaxis.lk',
            'X-Title': 'Airport Taxi Tours SEO Pipeline — Writer'
        },
        body: JSON.stringify({
            model: 'anthropic/claude-3.5-sonnet',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 4000
        })
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`[Phase 3] Claude error ${res.status}: ${err}`);
    }

    const data = await res.json();
    const content = data.choices[0].message.content.trim();
    console.log(`[Phase 3] Written: ~${content.split(/\s+/).length} words`);
    return content;
}

// ─────────────────────────────────────────────
// PHASE 4: CMS Publish
// ─────────────────────────────────────────────
async function phase4_publish(brief, content) {
    const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

    // Fetch Unsplash image
    let imageUrl = '/hero.jpg';
    if (UNSPLASH_ACCESS_KEY && brief.imageSearchQuery) {
        try {
            const imgRes = await fetch(
                `https://api.unsplash.com/search/photos?query=${encodeURIComponent(brief.imageSearchQuery)}&per_page=1&orientation=landscape`,
                { headers: { 'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
            );
            if (imgRes.ok) {
                const imgData = await imgRes.json();
                if (imgData.results?.[0]) imageUrl = imgData.results[0].urls.regular;
            }
        } catch (e) {
            console.warn('[Phase 4] Image fetch failed:', e.message);
        }
    }

    // Ensure unique slug
    let slug = brief.slug || brief.primaryKeyword.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const existing = await BlogPost.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now()}`;

    const post = await BlogPost.create({
        title: brief.h1Title,
        slug,
        excerpt: brief.metaDescription,
        content,
        seo: {
            metaTitle: brief.metaTitle,
            metaDescription: brief.metaDescription,
            keywords: [brief.primaryKeyword, ...(brief.lsiKeywords || [])].slice(0, 8)
        },
        tags: (brief.lsiKeywords || []).slice(0, 4),
        imageUrl,
        isPublished: true,
        author: 'AI SEO Pipeline'
    });

    revalidatePath('/blog');
    revalidatePath('/');
    console.log(`[Phase 4] Published: "${post.title}" → /blog/${slug}`);
    return post;
}

// ─────────────────────────────────────────────
// MAIN PIPELINE RUNNER (exported for reuse)
// ─────────────────────────────────────────────
export async function runSEOPipeline(keyword) {
    console.log(`\n🚀 [SEO Pipeline] Starting for: "${keyword}"`);

    await dbConnect();

    const serpData = await phase1_serpResearch(keyword);
    const brief = await phase2_contentStrategy(serpData);
    const content = await phase3_writeContent(brief);
    const post = await phase4_publish(brief, content);

    return {
        success: true,
        keyword,
        serpSkipped: serpData.serpSkipped,
        brief: { h1Title: brief.h1Title, metaTitle: brief.metaTitle, slug: post.slug },
        wordCount: content.split(/\s+/).length,
        postId: post._id,
        slug: post.slug,
        title: post.title
    };
}

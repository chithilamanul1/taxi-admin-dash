/**
 * SEO Pipeline Library - 4-Phase Content Engine (Free Tier)
 *
 * Phase 1: SERP Research (SerpApi)              - Real Google Sri Lanka data
 * Phase 2: Content Strategy (Gemini 2.0 Flash)  - Gap analysis + content brief
 * Phase 3: Content Writing (Gemini 2.0 Flash)   - 1400+ word article
 * Phase 4: CMS Publish (MongoDB + Next.js)       - Instant publish
 *
 * Models used: google/gemini-2.0-flash-exp:free (FREE tier, no credits needed)
 */

import dbConnect from '@/lib/db';
import BlogPost from '@/models/Post';
import { revalidatePath } from 'next/cache';

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1515670076726972486/WCQYeLEJp0P4az1GlvY3I1nAu2IybUv09Rp2FFSFDrsM5cEqsgPWFhgEoMsCzZRxQOhr';

// Free model - no credits needed on OpenRouter
const FREE_MODEL = 'google/gemini-2.0-flash-exp:free';

// ─────────────────────────────────────────────
// OPENROUTER HELPER
// ─────────────────────────────────────────────
async function callOpenRouter(messages, label, maxTokens = 3000) {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://airporttaxis.lk',
            'X-Title': 'Airport Taxis SEO Pipeline'
        },
        body: JSON.stringify({
            model: FREE_MODEL,
            messages,
            max_tokens: maxTokens,
            temperature: 0.7
        })
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`[${label}] OpenRouter error ${res.status}: ${err}`);
    }

    const data = await res.json();
    return data.choices[0].message.content.trim();
}

// ─────────────────────────────────────────────
// DISCORD NOTIFIER
// ─────────────────────────────────────────────
export async function notifyDiscord(payload) {
    try {
        await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (err) {
        console.error('[Discord] Notification failed:', err.message);
    }
}

// ─────────────────────────────────────────────
// SEARCH ENGINE PINGER
// ─────────────────────────────────────────────
export async function pingSearchEngines(slug) {
    const SITE_URL = 'https://airporttaxis.lk';
    const sitemapUrl = encodeURIComponent(`${SITE_URL}/sitemap.xml`);
    const postUrl = encodeURIComponent(`${SITE_URL}/blog/${slug}`);

    const pings = [
        `https://www.google.com/ping?sitemap=${sitemapUrl}`,
        `https://www.bing.com/ping?sitemap=${sitemapUrl}`,
        `https://api.indexnow.org/indexnow?url=${postUrl}&key=airporttaxis`
    ];

    const results = await Promise.allSettled(
        pings.map(url => fetch(url, { method: 'GET' }).then(r => ({ url, status: r.status })))
    );

    results.forEach(r => {
        if (r.status === 'fulfilled') {
            console.log(`[Ping] ${r.value.url} -> ${r.value.status}`);
        } else {
            console.warn(`[Ping] Failed: ${r.reason}`);
        }
    });

    return results;
}

// ─────────────────────────────────────────────
// PHASE 1: SERP Research
// ─────────────────────────────────────────────
async function phase1_serpResearch(keyword) {
    const SERPAPI_KEY = process.env.SERPAPI_KEY;

    if (!SERPAPI_KEY) {
        console.warn('[Phase 1] No SERPAPI_KEY - skipping SERP research');
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

        console.log(`[Phase 1] SERP: ${topResults.length} results, ${peopleAlsoAsk.length} PAA`);
        return { keyword, topResults, peopleAlsoAsk, relatedSearches, serpSkipped: false };

    } catch (err) {
        console.error('[Phase 1] SERP failed:', err.message);
        return { keyword, topResults: [], peopleAlsoAsk: [], relatedSearches: [], serpSkipped: true };
    }
}

// ─────────────────────────────────────────────
// PHASE 2: Content Strategy (Gemini 2.0 Flash Free)
// ─────────────────────────────────────────────
async function phase2_contentStrategy(serpData) {
    const { keyword, topResults, peopleAlsoAsk, relatedSearches } = serpData;

    const competitorText = topResults.length > 0
        ? topResults.map((r, i) => `${i + 1}. "${r.title}" - ${r.snippet}`).join('\n')
        : '(No competitor data - use keyword intent analysis)';

    const paaText = peopleAlsoAsk.length > 0
        ? peopleAlsoAsk.map(q => `- ${q.question}`).join('\n')
        : '(Infer likely questions from keyword)';

    const prompt = `You are a senior SEO content strategist specializing in Sri Lanka travel and taxi services. Create a content brief to rank #1 on Google Sri Lanka for: "${keyword}".

COMPETITOR ANALYSIS:
${competitorText}

PEOPLE ALSO ASK:
${paaText}

RELATED SEARCHES: ${relatedSearches.length > 0 ? relatedSearches.join(', ') : 'N/A'}

Return ONLY a valid JSON object, no markdown fences, no explanation:
{
  "primaryKeyword": "${keyword}",
  "targetIntent": "informational",
  "wordCountTarget": 1400,
  "contentAngle": "unique angle that beats competitors",
  "h1Title": "SEO title 55-60 chars with keyword",
  "metaTitle": "under 60 chars - keyword + Airport Taxis",
  "metaDescription": "under 160 chars - benefit + CTA",
  "outline": [
    { "heading": "H2 heading", "purpose": "what this section covers", "keyPoints": ["point 1", "point 2"] }
  ],
  "lsiKeywords": ["related keyword 1", "related keyword 2", "related keyword 3"],
  "faqQuestions": ["FAQ question 1?", "FAQ question 2?", "FAQ question 3?"],
  "imageSearchQuery": "sri lanka airport taxi",
  "internalLinkSuggestions": ["/booking", "/fleet", "/tour-packages"],
  "slug": "url-friendly-slug"
}`;

    const raw = await callOpenRouter(
        [{ role: 'user', content: prompt }],
        'Phase 2',
        2000
    );

    // Extract JSON from response (handle any wrapping text)
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('[Phase 2] No JSON found in Gemini response');
    const brief = JSON.parse(jsonMatch[0]);
    console.log(`[Phase 2] Brief: "${brief.h1Title}"`);
    return brief;
}

// ─────────────────────────────────────────────
// PHASE 3: Content Writing (Gemini 2.0 Flash Free)
// ─────────────────────────────────────────────
async function phase3_writeContent(brief) {
    const outlineText = (brief.outline || []).map((s, i) =>
        `${i + 1}. ## ${s.heading}\n   Purpose: ${s.purpose}\n   Key Points: ${(s.keyPoints || []).join(', ')}`
    ).join('\n\n');

    const faqText = (brief.faqQuestions || []).map((q, i) => `FAQ ${i + 1}: ${q}`).join('\n');
    const linksText = (brief.internalLinkSuggestions || []).map(l => `- ${l}`).join('\n');

    const prompt = `You are an expert travel content writer for Airport Taxi Tours (airporttaxis.lk), Sri Lanka's top private driver and tour service.

Write a comprehensive 1400+ word SEO blog post in Markdown for this brief:

PRIMARY KEYWORD: "${brief.primaryKeyword}"
H1 TITLE: ${brief.h1Title}
CONTENT ANGLE: ${brief.contentAngle}
LSI KEYWORDS TO USE: ${(brief.lsiKeywords || []).join(', ')}

ARTICLE OUTLINE:
${outlineText}

FAQ QUESTIONS TO ANSWER:
${faqText}

INTERNAL LINKS TO INCLUDE:
${linksText}

WRITING RULES:
1. Start directly with "## [first H2 heading]" - do NOT write the H1
2. Minimum 1400 words total
3. Weave in ALL LSI keywords naturally throughout
4. Include real Sri Lanka facts: place names, distances in km, journey times, LKR price ranges
5. Each H2 section must be at least 150 words
6. Include a "## Frequently Asked Questions" section answering all FAQ questions
7. End the article with exactly: "Ready to book? Visit airporttaxis.lk for instant online booking with fixed rates, 24/7 service, and professional English-speaking drivers."
8. Use bullet points, numbered lists, and **bold text** for scannable reading
9. Do NOT mention any competitor brands or companies
10. Write naturally for humans, not robots

Return ONLY the Markdown content, no JSON, no code fences, no extra commentary.`;

    const content = await callOpenRouter(
        [{ role: 'user', content: prompt }],
        'Phase 3',
        4000
    );

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
    console.log(`[Phase 4] Published: "${post.title}" -> /blog/${slug}`);
    return post;
}

// ─────────────────────────────────────────────
// MAIN PIPELINE RUNNER
// ─────────────────────────────────────────────
export async function runSEOPipeline(keyword) {
    console.log(`\n[SEO Pipeline] Starting for: "${keyword}" using ${FREE_MODEL}`);

    await dbConnect();

    const serpData = await phase1_serpResearch(keyword);
    const brief = await phase2_contentStrategy(serpData);
    const content = await phase3_writeContent(brief);
    const post = await phase4_publish(brief, content);

    return {
        success: true,
        keyword,
        model: FREE_MODEL,
        serpSkipped: serpData.serpSkipped,
        brief: { h1Title: brief.h1Title, metaTitle: brief.metaTitle, slug: post.slug },
        wordCount: content.split(/\s+/).length,
        postId: post._id,
        slug: post.slug,
        title: post.title
    };
}

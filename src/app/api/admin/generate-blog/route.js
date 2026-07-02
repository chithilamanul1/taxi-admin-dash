import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import BlogPost from '@/models/Post';
import { revalidatePath } from 'next/cache';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export async function POST(req) {
    try {
        await dbConnect();
        const { topic } = await req.json();

        if (!topic) {
            return NextResponse.json({ success: false, error: 'Topic is required' }, { status: 400 });
        }

        if (!OPENROUTER_API_KEY) {
            return NextResponse.json({ success: false, error: 'OPENROUTER_API_KEY is not configured.' }, { status: 500 });
        }

        console.log(`[AI Blog Generator] Generating blog for topic: ${topic}`);

        // 1. Generate Blog Content using OpenRouter (Gemini 2.5 Flash)
        const systemPrompt = `You are an expert travel blogger and SEO specialist for "Airport Taxi Tours" (airporttaxis.lk), a private driver and tour company in Sri Lanka.

Your task is to write a COMPREHENSIVE, highly engaging, and AGGRESSIVELY SEO-optimized blog post in Markdown format based on the user's topic. This post must rank #1 in Google Sri Lanka.

SEO RULES:
- Minimum 1200 words (aim for 1400–1600 words)
- Target keyword must appear in: the title, the first sentence, at least 3 H2/H3 headings, and 5+ times in the body
- Include LSI keywords naturally: sri lanka, colombo, airport, taxi, transfer, booking, driver, tour, kandy, galle
- Use H2 and H3 headings (NEVER H1 — that's for the page title)
- Write in a friendly, authoritative, informative tone
- Include real facts: mention specific Sri Lanka places, approximate distances (in km), and journey durations
- Include a "Frequently Asked Questions" section with 4–5 Q&A pairs at the end
- End every post with a strong CTA paragraph to book at airporttaxis.lk

Your response MUST be a raw, valid JSON object (do not wrap it in markdown code blocks like \`\`\`json) with the following structure:
{
  "title": "A catchy, SEO-optimized title containing the primary keyword (50–60 chars)",
  "slug": "url-friendly-slug-with-primary-keyword-and-keywords",
  "excerpt": "A compelling 150–160 character meta description with the keyword and a clear benefit",
  "content": "## Markdown content here... (1200+ words, proper H2/H3, FAQ at end, CTA at end)",
  "seo": {
    "metaTitle": "Primary Keyword | Airport Taxis Sri Lanka (under 60 chars)",
    "metaDescription": "Under 160 chars with keyword, mention airporttaxis.lk, strong CTA",
    "keywords": ["primary keyword", "related keyword 1", "related keyword 2", "sri lanka", "airport taxi"]
  },
  "tags": ["tag1", "tag2", "tag3"],
  "imageSearchQuery": "A simple 2-3 word search query for Unsplash (e.g. 'sri lanka beach', 'kandy temple', 'colombo airport')"
}`;

        const aiRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://airporttaxis.lk',
                'X-Title': 'Airport Taxi Tours AI Writer'
            },
            body: JSON.stringify({
                model: 'google/gemini-2.5-flash',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Topic / Target Keyword: ${topic}` }
                ],
                response_format: { type: 'json_object' },
                max_tokens: 3500
            })
        });

        if (!aiRes.ok) {
            const errText = await aiRes.text();
            throw new Error(`OpenRouter API error: ${aiRes.status} — ${errText}`);
        }

        const aiData = await aiRes.json();
        const aiMessage = aiData.choices[0].message.content;
        
        let blogData;
        try {
            const cleanedJsonString = aiMessage.replace(/```json\n?|```/g, '').trim();
            blogData = JSON.parse(cleanedJsonString);
        } catch (e) {
            console.error('Failed to parse AI response:', aiMessage);
            throw new Error('AI returned invalid JSON format.');
        }

        console.log(`[AI Blog Generator] Content generated. Fetching image: ${blogData.imageSearchQuery}`);

        // 2. Fetch Image from Unsplash
        let imageUrl = '/hero.jpg';
        try {
            if (UNSPLASH_ACCESS_KEY) {
                const unsplashRes = await fetch(
                    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(blogData.imageSearchQuery)}&per_page=1&orientation=landscape`,
                    { headers: { 'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}` } }
                );
                if (unsplashRes.ok) {
                    const unsplashData = await unsplashRes.json();
                    if (unsplashData.results?.length > 0) imageUrl = unsplashData.results[0].urls.regular;
                } else {
                    console.warn(`Unsplash API error: ${unsplashRes.status}`);
                }
            }
        } catch (imgError) {
            console.error('Unsplash Fetch Error:', imgError);
        }

        // 3. Ensure unique slug
        let finalSlug = blogData.slug;
        const existingPost = await BlogPost.findOne({ slug: finalSlug });
        if (existingPost) {
            finalSlug = `${finalSlug}-${Date.now()}`;
        }

        // 4. Save to MongoDB
        const newPost = await BlogPost.create({
            title: blogData.title,
            slug: finalSlug,
            excerpt: blogData.excerpt,
            content: blogData.content,
            seo: blogData.seo,
            tags: blogData.tags,
            imageUrl: imageUrl,
            isPublished: true,
            author: 'AI Content Engine'
        });

        // 5. Revalidate Caches
        revalidatePath('/blog');
        revalidatePath('/');

        return NextResponse.json({ success: true, data: newPost });

    } catch (error) {
        console.error('AI Blog Generation Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

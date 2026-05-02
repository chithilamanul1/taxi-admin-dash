import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
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

        console.log(`[AI Blog Generator] Generating blog for topic: ${topic}`);

        // 1. Generate Blog Content using OpenRouter (Gemini 2.5 Flash)
        const systemPrompt = `You are an expert travel blogger and SEO specialist for "Airport Taxi Tours", a private driver and tour company in Sri Lanka.
Your task is to write a comprehensive, highly engaging, and SEO-optimized blog post in Markdown format based on the user's topic.
Your response MUST be a raw, valid JSON object (do not wrap it in markdown code blocks like \`\`\`json) with the following structure:
{
  "title": "A catchy, SEO-optimized title",
  "slug": "url-friendly-slug-with-keywords",
  "excerpt": "A compelling 1-2 sentence meta description/excerpt",
  "content": "# Markdown content here... (Make it at least 600 words, use headers, bullet points, and promote Airport Taxi Tours at the end)",
  "seo": {
    "metaTitle": "SEO title under 60 chars",
    "metaDescription": "SEO description under 160 chars",
    "keywords": ["keyword1", "keyword2", "keyword3", "sri lanka"]
  },
  "tags": ["tag1", "tag2"],
  "imageSearchQuery": "A simple 2-3 word search query for Unsplash to find a relevant cover image (e.g., 'sri lanka beach', 'kandy temple', 'elephants nature')"
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
                model: 'google/gemini-2.5-flash:free',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Topic: ${topic}` }
                ],
                response_format: { type: "json_object" }
            })
        });

        if (!aiRes.ok) {
            throw new Error(`OpenRouter API error: ${aiRes.status}`);
        }

        const aiData = await aiRes.json();
        const aiMessage = aiData.choices[0].message.content;
        
        let blogData;
        try {
            // Remove any markdown formatting if the model still outputs it
            const cleanedJsonString = aiMessage.replace(/```json\n?|```/g, '').trim();
            blogData = JSON.parse(cleanedJsonString);
        } catch (e) {
            console.error("Failed to parse AI response:", aiMessage);
            throw new Error("AI returned invalid JSON format.");
        }

        console.log(`[AI Blog Generator] AI Content Generated. Searching Unsplash for: ${blogData.imageSearchQuery}`);

        // 2. Fetch Image from Unsplash
        let imageUrl = '/hero.jpg'; // Fallback
        try {
            const unsplashRes = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(blogData.imageSearchQuery)}&per_page=1&orientation=landscape`, {
                headers: {
                    'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`
                }
            });
            
            if (unsplashRes.ok) {
                const unsplashData = await unsplashRes.json();
                if (unsplashData.results && unsplashData.results.length > 0) {
                    imageUrl = unsplashData.results[0].urls.regular;
                }
            } else {
                console.warn(`Unsplash API error: ${unsplashRes.status}`);
            }
        } catch (imgError) {
            console.error("Unsplash Fetch Error:", imgError);
        }

        // 3. Save to MongoDB
        const newPost = await BlogPost.create({
            title: blogData.title,
            slug: blogData.slug,
            excerpt: blogData.excerpt,
            content: blogData.content,
            seo: blogData.seo,
            tags: blogData.tags,
            imageUrl: imageUrl,
            isPublished: true,
            author: 'AI Content Engine'
        });

        // 4. Revalidate Caches
        revalidatePath('/blog');
        revalidatePath('/');

        return NextResponse.json({ success: true, data: newPost });

    } catch (error) {
        console.error('AI Blog Generation Error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

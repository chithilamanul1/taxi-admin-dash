import dbConnect from '../../../lib/db';
import Post from '../../../models/Post';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import BlogCoverImage from '../../../components/BlogCoverImage';

async function getPost(slug) {
    const connectionString = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!connectionString) {
        console.error('Blog Error: MONGODB_URI is missing');
        return null;
    }
    
    try {
        await dbConnect();
        const rawSlug = slug;
        const decodedSlug = decodeURIComponent(slug).trim();
        
        console.log(`Searching for blog post with slug: ${decodedSlug} (Raw: ${rawSlug})`);

        // 1. Try exact match with decoded slug (case-insensitive)
        let post = await Post.findOne({ 
            slug: { $regex: new RegExp(`^${decodedSlug}$`, 'i') } 
        });

        // 2. Try normalized slug (hyphenated)
        if (!post) {
            const normalized = decodedSlug
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            
            if (normalized !== decodedSlug.toLowerCase()) {
                console.log(`Trying normalized slug: ${normalized}`);
                post = await Post.findOne({ slug: normalized });
            }
        }

        // 3. Try regex match for spaces vs hyphens vs underscores (very common issue)
        if (!post) {
            // Replace any separator with a regex char class
            const pattern = decodedSlug.replace(/[ \-_]+/g, '[ \\-_]');
            console.log(`Trying regex pattern: ${pattern}`);
            post = await Post.findOne({ 
                slug: { $regex: new RegExp(`^${pattern}$`, 'i') } 
            });
        }

        // 4. Try matching the title itself if slug fails
        if (!post) {
            const titlePattern = decodedSlug.replace(/[ \-_]+/g, '[ \\-_]');
            console.log(`Trying title match with: ${titlePattern}`);
            post = await Post.findOne({ 
                title: { $regex: new RegExp(`^${titlePattern}$`, 'i') } 
            });
        }

        if (post) {
            console.log(`Success! Found post: ${post.title}`);
        } else {
            console.warn(`Post NOT found for slug: ${decodedSlug}`);
        }

        return post;
    } catch (e) {
        console.error('Blog Post DB Error:', e);
        return null;
    }
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const post = await getPost(slug);
    if (!post) return {};

    return {
        title: post.seo?.metaTitle || post.title,
        description: post.seo?.metaDescription || post.excerpt,
        openGraph: {
            title: post.seo?.metaTitle || post.title,
            description: post.seo?.metaDescription || post.excerpt,
            images: [post.imageUrl || '/logo.png'],
        }
    };
}

export default async function SinglePostPage({ params }) {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt || post.seo?.metaDescription,
        "image": post.imageUrl || 'https://airporttaxis.lk/og-image.jpg',
        "author": {
            "@type": "Person",
            "name": post.author || "Airport Taxis Sri Lanka"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Airport Taxis (Pvt) Ltd",
            "logo": {
                "@type": "ImageObject",
                "url": "https://airporttaxis.lk/logo.png"
            }
        },
        "datePublished": post.createdAt,
        "url": `https://airporttaxis.lk/blog/${slug}`
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        <article className="min-h-screen bg-slate-50 pb-20 transition-colors relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 -mr-48 -mt-48 blur-3xl rounded-full pointer-events-none"></div>

            {/* Header with Image */}
            <div className="relative h-[50vh] md:h-[60vh] w-full">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10" />
                <BlogCoverImage
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-end container mx-auto px-6 pb-20 max-w-4xl">
                    <Link href="/blog" className="text-white hover:text-emerald-300 mb-8 flex items-center gap-2 w-fit transition-all font-medium text-sm">
                        <ArrowLeft size={16} /> Back to Journal
                    </Link>
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap gap-6 text-slate-200 text-sm font-medium">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-emerald-400" />
                            {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2">
                            <User size={16} className="text-emerald-400" />
                            By {post.author || 'Admin'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 -mt-10 relative z-30 max-w-4xl">
                <div className="bg-white rounded-2xl p-6 md:p-12 shadow-xl shadow-slate-200/50 relative overflow-hidden ring-1 ring-slate-100">
                    
                    <div className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900 prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-lg">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap gap-3">
                            {post.tags.map(tag => (
                                <span key={tag} className="bg-slate-50 text-slate-600 px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-slate-100 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-default">
                                    <Tag size={12} className="text-emerald-500" /> {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </article>
        </>
    );
}

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

    return (
        <article className="min-h-screen bg-[#111827] pb-20 transition-colors relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#FACC15]/5 -mr-48 -mt-48 blur-3xl rounded-none"></div>

            {/* Header with Image */}
            <div className="relative h-[60vh] md:h-[70vh] w-full border-b-8 border-black">
                <div className="absolute inset-0 bg-black/60 z-10" />
                <BlogCoverImage
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover grayscale"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-end container mx-auto px-6 pb-24 max-w-7xl">
                    <Link href="/blog" className="text-[#FACC15] hover:text-white mb-8 flex items-center gap-3 w-fit transition-all font-black uppercase tracking-[0.2em] italic text-xs bg-black px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_#FACC15]">
                        <ArrowLeft size={18} strokeWidth={4} /> Back to Journal
                    </Link>
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-8 leading-none max-w-5xl uppercase italic tracking-tighter">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap gap-10 text-white/70 text-[10px] font-black uppercase tracking-[0.3em] italic">
                        <div className="flex items-center gap-3">
                            <Calendar size={20} className="text-[#FACC15]" strokeWidth={3} />
                            {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-3">
                            <User size={20} className="text-[#FACC15]" strokeWidth={3} />
                            CHAUFFEUR INSIGHTS: {post.author || 'ADMIN'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-6 -mt-16 relative z-30 max-w-5xl">
                <div className="bg-[#1c2433] rounded-none border-4 border-black p-8 md:p-16 shadow-[15px_15px_0px_0px_#FACC15] relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FACC15]/5 -mr-16 -mt-16 rounded-full blur-2xl"></div>
                    
                    <div className="prose prose-lg prose-invert max-w-none prose-headings:text-white prose-headings:italic prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tighter prose-p:text-white/90 prose-p:leading-relaxed prose-strong:text-[#FACC15] prose-a:text-[#FACC15] prose-a:no-underline prose-a:font-black hover:prose-a:underline prose-img:rounded-none prose-img:border-4 prose-img:border-black prose-img:shadow-[8px_8px_0px_0px_#FACC15]">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-16 pt-10 border-t-4 border-black flex flex-wrap gap-4">
                            {post.tags.map(tag => (
                                <span key={tag} className="bg-black text-[#FACC15] px-4 py-2 rounded-none text-[10px] font-black uppercase tracking-[0.2em] italic border-2 border-black shadow-[4px_4px_0px_0px_#FACC15]/40 flex items-center gap-2">
                                    <Tag size={14} strokeWidth={3} /> {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}

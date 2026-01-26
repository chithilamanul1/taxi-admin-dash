import dbConnect from '../../../lib/db';
import Post from '../../../models/Post';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import BlogCoverImage from '../../../components/BlogCoverImage';

async function getPost(slug) {
    await dbConnect();
    const post = await Post.findOne({ slug, isPublished: true });
    return post;
}

export async function generateMetadata({ params }) {
    const post = await getPost(params.slug);
    if (!post) return {};

    return {
        title: post.seo?.metaTitle || post.title,
        description: post.seo?.metaDescription || post.excerpt,
        openGraph: {
            title: post.seo?.metaTitle || post.title,
            description: post.seo?.metaDescription || post.excerpt,
            images: [post.coverImage || '/logo.png'],
        }
    };
}

export default async function SinglePostPage({ params }) {
    const post = await getPost(params.slug);

    if (!post) {
        notFound();
    }

    return (
        <article className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors">
            {/* Header with Image */}
            <div className="relative h-[60vh] md:h-[70vh] w-full">
                <div className="absolute inset-0 bg-black/40 z-10" />
                <BlogCoverImage
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-end container mx-auto px-4 pb-20">
                    <Link href="/blog" className="text-white/80 hover:text-white mb-6 flex items-center gap-2 w-fit transition-colors">
                        <ArrowLeft size={20} /> Back to Blog
                    </Link>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight max-w-4xl">
                        {post.title}
                    </h1>
                    <div className="flex flex-wrap gap-6 text-white/90 text-sm md:text-base">
                        <div className="flex items-center gap-2">
                            <Calendar size={18} className="text-emerald-600 dark:text-emerald-400" />
                            {new Date(post.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="flex items-center gap-2">
                            <User size={18} className="text-emerald-600 dark:text-emerald-400" />
                            By {post.author || 'Admin'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 -mt-10 relative z-30">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 md:p-12 max-w-4xl mx-auto border border-white/10">
                    <div className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:text-emerald-900 dark:prose-headings:text-white prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-img:rounded-xl">
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-slate-100 dark:border-white/5 flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <span key={tag} className="bg-slate-100 dark:bg-white/5 text-emerald-900 dark:text-emerald-400 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                                    <Tag size={14} /> {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';
import Loader from './Loader';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  category?: string;
  level?: string;
}

export default function KnowledgeSection() {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch blog posts when component mounts
    useEffect(() => {
        async function fetchBlogPosts() {
            try {
                setLoading(true);
                const response = await fetch('/api/blog');
                if (!response.ok) {
                    throw new Error('Failed to fetch blog posts');
                }
                const data = await response.json();
                
                // Filter for published posts and take the latest 3
                const publishedPosts = data
                    .filter((post: BlogPost) => post.isPublished)
                    .sort((a: BlogPost, b: BlogPost) => {
                        const dateA = a.publishedAt ? new Date(a.publishedAt) : new Date(a.createdAt);
                        const dateB = b.publishedAt ? new Date(b.publishedAt) : new Date(b.createdAt);
                        return dateB.getTime() - dateA.getTime();
                    })
                    .slice(0, 3);
                
                setBlogPosts(publishedPosts);
            } catch (err) {
                console.error('Error fetching blog posts:', err);
                setError('אירעה שגיאה בטעינת המאמרים');
            } finally {
                setLoading(false);
            }
        }

        fetchBlogPosts();
    }, []);

    // Format date helper
    function formatDate(dateString: string) {
        return format(new Date(dateString), 'dd בMMMM, yyyy', { locale: he });
    }

    return (
        <section className="py-16">
            <div className="container mx-auto max-w-5xl px-4">
                <h2 className="text-5xl text-center mb-12 text-[#012E3E]">
                    ידע זה כוח <span className="font-bold">הנה כמה תכנים להתחיל מהם</span>
                </h2>
            </div>
            
            <div className="bg-[#022E41] w-full py-16">
                <div className="container mx-auto max-w-5xl px-4 flex flex-col items-center">
                    {loading ? (
                        <Loader size="small" />
                    ) : error ? (
                        <div className="bg-white p-6 rounded-lg text-center text-red-500">
                            {error}
                        </div>
                    ) : blogPosts.length === 0 ? (
                        <div className="bg-white p-6 rounded-lg text-center">
                            <p className="text-lg text-gray-600 mb-4">עדיין אין מאמרים.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {blogPosts.map((post) => (
                                <div key={post._id} className="bg-white p-6 rounded-lg shadow-md flex flex-col h-[350px]">
                                    <h3 className="text-2xl font-bold mb-2 text-[#022E41]">{post.title}</h3>
                                    <div className="flex items-center text-gray-500 mb-4">
                                        <FaCalendarAlt className="mr-2" />
                                        <span className="text-sm pr-2">
                                            {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 mb-6 flex-grow overflow-y-auto">
                                        {post.excerpt || post.title}
                                    </p>
                                    <Link 
                                        href={`/blog/${post.slug}`}
                                        className="mt-auto text-[#32a191] font-bold flex items-center group self-start"
                                    >
                                        <span className="transition-transform duration-300 group-hover:-translate-x-1">קרא עוד</span>
                                        <FaArrowLeft className="mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                    <Link 
                        href="/blog" 
                        className="mx-auto bg-white text-[#022E41] font-bold px-8 py-4 mt-8 rounded-md hover:bg-[#32a191] hover:text-white transition-colors duration-300 flex items-center shadow-md group"
                    >
                        <span>בואו ללמוד עוד</span>
                        <FaArrowLeft className="mr-3 transition-transform group-hover:-translate-x-1" />
                    </Link>
                </div>
            </div>
        </section>
    );
}   
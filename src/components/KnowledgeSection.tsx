"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';
import LogoLoader from './LogoLoader';

type BlogPost = {
  _id: string;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  createdAt: string;
};

export default function KnowledgeSection() {
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchLatestBlogPosts() {
            try {
                setLoading(true);
                const res = await fetch('/api/blog?limit=3&isPublished=true');
                
                if (!res.ok) {
                    throw new Error('Failed to fetch blog posts');
                }
                
                const data = await res.json();
                
                // Add artificial delay to showcase the loader (5 seconds)
                await new Promise(resolve => setTimeout(resolve, 5000));
                
                setBlogPosts(data);
            } catch (err) {
                console.error('Error fetching blog posts:', err);
                setError('Failed to load latest blog posts');
            } finally {
                setLoading(false);
            }
        }
        
        fetchLatestBlogPosts();
    }, []);

    // Format date to Hebrew format
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('he-IL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

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
                        <div className="flex justify-center w-full py-12">
                            <LogoLoader />
                        </div>
                    ) : error ? (
                        <div className="text-white text-center py-12">
                            <p>{error}</p>
                        </div>
                    ) : blogPosts.length === 0 ? (
                        <div className="text-white text-center py-12">
                            <p>אין תכנים להצגה כרגע. בקרוב יתווספו מאמרים חדשים!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {blogPosts.map((post) => (
                                <div key={post._id} className="bg-white p-6 rounded-lg shadow-md flex flex-col h-[350px]">
                                    <h3 className="text-2xl font-bold mb-2 text-[#022E41]">{post.title}</h3>
                                    <div className="flex items-center text-gray-500 mb-4">
                                        <FaCalendarAlt className="mr-2" />
                                        <span className="text-sm pr-2">{formatDate(post.date || post.createdAt)}</span>
                                    </div>
                                    <p className="text-gray-600 mb-6 flex-grow overflow-y-auto">{post.excerpt}</p>
                                    <Link 
                                        href={`/מאמרים/${post.slug}`}
                                        className="mt-auto text-[#32a191] font-bold flex items-center group self-start"
                                    >
                                        <span className="transition-transform duration-300 group-hover:-translate-x-1">קרא עוד</span>
                                        <FaArrowLeft className="mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <Link href="/blog" className='mx-auto bg-white text-black px-6 py-4 mt-8 rounded-md hover:bg-gray-100 transition-colors'>
                        בואו ללמוד עוד
                    </Link>
                </div>
            </div>
        </section>
    );
}   
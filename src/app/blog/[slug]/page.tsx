'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Link from 'next/link';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  category?: string;
  level?: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const { slug } = params;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogPost() {
      try {
        setLoading(true);
        const response = await fetch(`/api/blog/${slug}`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog post');
        }
        const data = await response.json();
        setPost(data);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('אירעה שגיאה בטעינת המאמר. נסה שוב מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchBlogPost();
    }
  }, [slug]);

  // Format date helper
  function formatDate(dateString: string) {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: he });
  }

  if (loading) {
    return (
      <MaxWidthWrapper>
        <div className="py-12 text-center">
          <div className="text-2xl font-medium text-gray-600">טוען מאמר...</div>
        </div>
      </MaxWidthWrapper>
    );
  }

  if (error || !post) {
    return (
      <MaxWidthWrapper>
        <div className="py-12">
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center mb-8">
            {error || 'לא נמצא מאמר בכתובת זו'}
          </div>
          <div className="text-center">
            <Link 
              href="/blog"
              className="inline-block bg-[#32a191] text-white px-4 py-2 rounded-md"
            >
              חזור לרשימת המאמרים
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    );
  }

  return (
    <>
      {/* Header Banner */}
      <div className="bg-[#002F42] py-10">
        <MaxWidthWrapper>
          <div className="text-center text-white" dir="rtl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-lg md:text-xl max-w-3xl mx-auto mb-6">
                {post.excerpt}
              </p>
            )}
            <div className="text-sm opacity-75">
              <span>
                {post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}
              </span>
              {post.category && (
                <span className="mx-2">|</span>
              )}
              {post.category && (
                <span>{post.category}</span>
              )}
              {post.level && (
                <>
                  <span className="mx-2">|</span>
                  <span>רמה: {post.level}</span>
                </>
              )}
            </div>
          </div>
        </MaxWidthWrapper>
      </div>

      {/* Blog Content */}
      <MaxWidthWrapper className="py-12">
        <div className="max-w-3xl mx-auto" dir="rtl">
          {post.coverImage && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img 
                src={post.coverImage} 
                alt={post.title} 
                className="w-full h-auto" 
              />
            </div>
          )}
          
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12 pt-6 border-t border-gray-200">
            <Link 
              href="/blog"
              className="inline-block text-[#32a191] font-medium hover:text-[#002F42] transition-colors"
            >
              {'<<'} חזרה לכל המאמרים
            </Link>
          </div>
        </div>
      </MaxWidthWrapper>
    </>
  );
} 
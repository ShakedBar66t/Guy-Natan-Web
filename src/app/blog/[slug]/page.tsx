'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Link from 'next/link';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import Loader from '@/components/Loader';
import BlogSidebar from '@/components/BlogSidebar';
import ShareButtons from '@/components/ShareButtons';

interface FinancialTerm {
  _id: string;
  term: string;
  slug: string;
  definition: string;
}

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
  relatedTerms?: FinancialTerm[];
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>('');

  useEffect(() => {
    // Set the current URL for sharing
    setCurrentUrl(window.location.href);
    
    async function fetchBlogPost() {
      try {
        // Special case for 'new' which might be incorrectly navigated to
        if (slug === 'new') {
          setError('אין מאמר בשם "new". מנתב אותך לדף היצירה הנכון...');
          
          // Optional: If user is an admin, redirect them to the correct create page after a delay
          setTimeout(() => {
            window.location.href = '/admin/dashboard/blog/new';
          }, 3000);
          
          setLoading(false);
          return;
        }
        
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
      <div className="w-full flex justify-center items-center min-h-[50vh]">
        <Loader text="טוען מאמר..." size="large" />
      </div>
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
        <div className="flex flex-col-reverse lg:flex-row gap-8" dir="rtl">
          {/* Main Content */}
          <div className="flex-1">
            <div className="max-w-3xl mx-auto">
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
                className="prose prose-lg prose-headings:text-[#002F42] prose-headings:font-bold prose-ul:list-disc prose-ol:list-decimal prose-ul:pr-5 prose-ol:pr-5 prose-li:mb-1 prose-p:mb-4 max-w-none rtl"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
              
              {/* Related Terms Section */}
              {post.relatedTerms && post.relatedTerms.length > 0 && (
                <div className="mt-10 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-[#002F42] mb-4">מושגים פיננסיים קשורים</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.relatedTerms.map(term => (
                      <Link 
                        key={term._id} 
                        href={`/glossary/${term.slug}`}
                        className="inline-block bg-gray-100 hover:bg-gray-200 text-[#32a191] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        {term.term}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-12 pt-6 border-t border-gray-200">
                <Link 
                  href="/blog"
                  className="inline-block text-[#32a191] font-medium hover:text-[#002F42] transition-colors"
                >
                  {'<<'} חזרה לכל המאמרים
                </Link>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-80 xl:w-96 lg:flex-shrink-0 mb-8 lg:mb-0">
            <div className="lg:sticky lg:top-8">
              <BlogSidebar currentPostId={post._id} />
              
              {/* Share Buttons - added to bottom of sidebar */}
              <div className="mt-6 bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-[#002F42] mb-4 border-b border-gray-200 pb-2 text-center" dir="rtl">שתפו את המאמר</h3>
                <ShareButtons 
                  url={currentUrl} 
                  title={post.title} 
                  excerpt={post.excerpt || 'סקירה כלכלית מקצועית מבית גיא נתן'} 
                />
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </>
  );
} 
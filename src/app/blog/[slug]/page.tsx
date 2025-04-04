'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';

type BlogPost = {
  _id: string;
  title: string;
  content: string;
  excerpt: string;
  date: string;
  category: string;
  level: string;
  slug: string;
  isPublished: boolean;
};

export default function BlogPostPage() {
  const params = useParams();
  const [blogPost, setBlogPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogPost() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/blog?slug=${params.slug}&isPublished=true`);
        if (!response.ok) {
          throw new Error(`Failed to fetch blog post: ${response.status}`);
        }
        
        const data = await response.json();
        if (data && data.length > 0) {
          setBlogPost(data[0]);
          // Set the document title with the blog post title
          document.title = `${data[0].title} | גיא נתן בע״מ`;
        } else {
          setError('המאמר המבוקש לא נמצא');
          document.title = 'מאמר לא נמצא | גיא נתן בע״מ';
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('שגיאה בטעינת המאמר');
        document.title = 'שגיאה | גיא נתן בע״מ';
      } finally {
        setIsLoading(false);
      }
    }

    // Set default title while loading
    document.title = 'טוען מאמר... | גיא נתן בע״מ';

    if (params.slug) {
      fetchBlogPost();
    }
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !blogPost) {
    return (
      <div className="container mx-auto px-4 py-12" dir="rtl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">שגיאה</h2>
          <p>{error || 'המאמר המבוקש לא נמצא'}</p>
          <div className="mt-4">
            <Link href="/blog" className="text-[#32a191] hover:underline">
              חזרה לרשימת המאמרים
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Format the date
  const formattedDate = new Date(blogPost.date).toLocaleDateString('he-IL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6" dir="rtl">
        <Link href="/" className="text-gray-600 hover:text-[#022E41]">
          עמוד הבית
        </Link>
        {' > '}
        <Link href="/blog" className="text-gray-600 hover:text-[#022E41]">
          הבלוג שלנו
        </Link>
        {' > '}
        <span className="text-gray-800">{blogPost.title}</span>
      </div>

      <article className="bg-white rounded-lg shadow-lg overflow-hidden" dir="rtl">
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{blogPost.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-6 text-sm text-gray-600">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {blogPost.category}
            </span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">
              {blogPost.level}
            </span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
              {formattedDate}
            </span>
          </div>
          
          {blogPost.excerpt && (
            <div className="mb-6 text-lg font-medium text-gray-700 italic border-r-4 border-blue-500 pr-4">
              {blogPost.excerpt}
            </div>
          )}
          
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
          />
        </div>
      </article>
      
      {/* Newsletter signup */}
      <div className="mt-12 mb-8 bg-[#32a191] rounded-lg p-8 text-white" dir="rtl">
        <h3 className="text-2xl font-bold mb-4 text-center">
          הירשמו לניוזלטר שלנו
        </h3>
        <p className="text-center mb-6">
          אל תפספסו עדכונים ומאמרים נוספים בנושאי פיננסים והשקעות
        </p>
        <form className="max-w-md mx-auto flex flex-col md:flex-row gap-3">
          <input 
            type="email" 
            placeholder="כתובת האימייל שלך" 
            className="flex-grow px-4 py-2 rounded-md border-0 focus:outline-none focus:ring-2 focus:ring-white text-gray-700"
          />
          <button 
            type="submit"
            className="bg-white text-[#32a191] font-medium py-2 px-6 rounded-md hover:bg-gray-100 transition-colors"
          >
            הרשמה
          </button>
        </form>
      </div>

      {/* Return to blog */}
      <div className="flex flex-col items-center justify-center space-y-4 mt-8 mb-12" dir="rtl">
        <Link 
          href="/blog" 
          className="bg-[#32a191] text-white px-6 py-3 rounded-lg hover:bg-[#022E41] transition-colors text-center"
        >
          לכל המאמרים שלנו
        </Link>
        
        <Link
          href="/"
          className="text-[#32a191] hover:text-[#022E41] mt-2"
        >
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
} 
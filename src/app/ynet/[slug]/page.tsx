'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { HiOutlineExternalLink } from 'react-icons/hi';

type YnetArticle = {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  date: string;
  headline?: string;
  isPublished: boolean;
  originalLink: string;
};

export default function YnetArticlePage({ params }: { params: { slug: string } }) {
  const [article, setArticle] = useState<YnetArticle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/ynet?slug=${params.slug}&isPublished=true`);
        
        if (!res.ok) {
          throw new Error(`Error fetching article: ${res.status}`);
        }
        
        const data = await res.json();
        if (data && data.length > 0) {
          setArticle(data[0]);
        } else {
          setError('מאמר לא נמצא');
        }
      } catch (err) {
        console.error('Failed to fetch article:', err);
        setError('Failed to fetch article. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [params.slug]);

  if (isLoading) {
    return (
      <MaxWidthWrapper className="py-12">
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </MaxWidthWrapper>
    );
  }

  if (error || !article) {
    return (
      <MaxWidthWrapper className="py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg text-center">
          <p className="text-xl font-bold mb-2">שגיאה</p>
          <p>{error || 'מאמר לא נמצא'}</p>
          <Link href="/ynet" className="mt-4 inline-block text-indigo-600 hover:underline">
            חזרה לרשימת הכתבות
          </Link>
        </div>
      </MaxWidthWrapper>
    );
  }

  return (
    <>
      {/* Ynet Capital Logo Header */}
      <div className="bg-white border-b border-gray-200 py-4">
        <MaxWidthWrapper>
          <div className="flex justify-center">
            <Image
              src="https://res.cloudinary.com/drld1bejg/image/upload/v1743282916/ynet-capital-logo_k1z4ip.svg"
              alt="YNET Capital"
              width={200}
              height={60}
            />
          </div>
        </MaxWidthWrapper>
      </div>

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-12">
        <MaxWidthWrapper>
          <div className="text-white max-w-3xl mx-auto">
            <Link href="/ynet" className="text-white/80 hover:text-white mb-4 inline-block">
              &laquo; חזרה לכל הכתבות
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
            <div className="flex items-center justify-between">
              <div className="text-white/80">
                {new Date(article.date).toLocaleDateString('he-IL')}
              </div>
              {article.originalLink && (
                <a 
                  href={article.originalLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-white flex items-center hover:underline"
                >
                  צפייה במקור <HiOutlineExternalLink className="ml-1" />
                </a>
              )}
            </div>
          </div>
        </MaxWidthWrapper>
      </div>

      {/* Content */}
      <MaxWidthWrapper className="py-12">
        <article className="prose prose-lg lg:prose-xl max-w-3xl mx-auto">
          <div className="mb-6 text-lg text-gray-700 font-medium">
            {article.excerpt}
          </div>
          
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>
      </MaxWidthWrapper>

      {/* Related Articles */}
      <div className="bg-gray-100 py-12">
        <MaxWidthWrapper>
          <h2 className="text-2xl font-bold mb-6 text-center">כתבות נוספות שעשויות לעניין אותך</h2>
          
          <div className="flex flex-col items-center justify-center space-y-4">
            <Link 
              href="/blog" 
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors text-center"
            >
              לכל המאמרים שלנו
            </Link>
            
            <Link
              href="/"
              className="text-indigo-600 hover:text-indigo-800"
            >
              חזרה לדף הבית
            </Link>
          </div>
        </MaxWidthWrapper>
      </div>
    </>
  );
} 
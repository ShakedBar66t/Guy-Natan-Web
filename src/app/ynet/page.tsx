'use client';

import { useState, useEffect } from 'react';
import Loader from '@/components/Loader';
import Link from 'next/link';
import { format } from 'date-fns';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

interface YnetArticle {
  _id: string;
  title: string;
  link: string;
  publishedAt: string;
}

export default function YnetPage() {
  const [articles, setArticles] = useState<YnetArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        const response = await fetch('/api/ynet');

        if (!response.ok) {
          throw new Error('Failed to fetch Ynet articles');
        }

        const data = await response.json();
        setArticles(data);
      } catch (err) {
        console.error('Error fetching Ynet articles:', err);
        setError('אירעה שגיאה בטעינת הכתבות');
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd.MM.yyyy');
    } catch (error) {
      return 'תאריך לא תקין';
    }
  };

  return (
    <>
      {/* Header Banner - Full Width */}
      <div className="bg-[#002F42] py-6 mb-8 w-full">
        <MaxWidthWrapper>
          <h1 className="text-white text-center text-5xl md:text-6xl font-bold mb-2">
            הטור של גיא נתן <span className="font-semibold text-5xl">ב-Ynet</span>
          </h1>
        </MaxWidthWrapper>
      </div>

      <MaxWidthWrapper>
        {/* Intro Section */}
        <div className="text-center mb-12" dir="rtl">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700">
              הנגשת ידע בתחום הפיננסי להמונים היא הליבה של העשייה שלנו, 
              כאן תוכלו למצוא כתבות המתפרסמות בשגרה במדור שוק ההון של Ynet ישראל.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <Loader size="medium" />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg text-red-700 text-center">
            {error}
          </div>
        ) : articles.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <p className="text-lg text-gray-600">
              אין כרגע כתבות Ynet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 mb-16" dir="rtl">
            {articles.map((article) => (
              <div key={article._id} className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden border border-black border-2">
                {/* YNET Logo */}
                <div className="flex justify-center py-4 bg-gray-200">
                  <img 
                    src="https://res.cloudinary.com/drld1bejg/image/upload/v1743282916/ynet-capital-logo_k1z4ip.svg" 
                    alt="YNET Capital Logo" 
                    className="h-8"
                  />
                </div>
                
                {/* Article Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold text-[#002F42] mb-3 hover:text-[#32a191] transition-colors">
                    {article.title}
                  </h2>
                  <div className="mb-4 text-gray-500 text-sm">
                    <span className="inline-block">
                      <span className="font-medium">{formatDate(article.publishedAt)}</span>
                    </span>
                  </div>
                  <div className="mt-auto">
                    <Link 
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-[#32a191] text-white px-4 py-2 rounded-lg hover:bg-[#002F42] transition-colors text-sm font-medium"
                    >
                      קראו עוד
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </MaxWidthWrapper>
    </>
  );
} 
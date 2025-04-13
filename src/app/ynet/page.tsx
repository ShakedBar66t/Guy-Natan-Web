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
  // Define component state variables
  const [articles, setArticles] = useState<YnetArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Safely format dates with error handling
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'תאריך לא זמין';
    
    try {
      return format(new Date(dateStr), 'dd.MM.yyyy');
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'תאריך לא תקין';
    }
  };

  // Fetch articles on component mount
  useEffect(() => {
    let isMounted = true;

    const fetchArticles = async () => {
      if (!isMounted) return;
      
      try {
        setLoading(true);
        
        const response = await fetch('/api/ynet', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });

        if (!isMounted) return;

        if (!response.ok) {
          throw new Error(`Failed to fetch Ynet articles: ${response.status}`);
        }

        const data = await response.json();
        
        if (!isMounted) return;
        
        setArticles(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        
        console.error('Error fetching Ynet articles:', err);
        setError('אירעה שגיאה בטעינת הכתבות. נסו שוב מאוחר יותר.');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Execute fetch and handle errors
    fetchArticles().catch(err => {
      if (isMounted) {
        console.error('Unexpected error in fetchArticles:', err);
        setError('אירעה שגיאה לא צפויה');
        setLoading(false);
      }
    });

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []);

  // Render component
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

        {/* Content conditionally rendered based on loading/error state */}
        {loading ? (
          <div className="flex justify-center">
            <Loader size="medium" />
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg text-red-700 text-center">
            {error}
          </div>
        ) : !articles || articles.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <p className="text-lg text-gray-600">
              אין כרגע כתבות Ynet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 mb-16" dir="rtl">
            {articles.map((article) => (
              <div key={article._id || `ynet-${Math.random()}`} className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden border border-black border-2">
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
                    {article.title || 'כותרת לא זמינה'}
                  </h2>
                  <div className="mb-4 text-gray-500 text-sm">
                    <span className="inline-block">
                      <span className="font-medium">{formatDate(article.publishedAt)}</span>
                    </span>
                  </div>
                  <div className="mt-auto">
                    {article.link ? (
                      <Link 
                        href={article.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-[#32a191] text-white px-4 py-2 rounded-lg hover:bg-[#002F42] transition-colors text-sm font-medium"
                      >
                        קראו עוד
                      </Link>
                    ) : (
                      <span className="inline-block bg-gray-400 text-white px-4 py-2 rounded-lg text-sm font-medium cursor-not-allowed">
                        קישור לא זמין
                      </span>
                    )}
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
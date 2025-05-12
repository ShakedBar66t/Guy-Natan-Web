'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import Link from 'next/link';
import Loader from './Loader';

interface YnetArticle {
  _id: string;
  title: string;
  publishedAt: string;
  link: string;
  slug: string;
}

export default function YnetArticles() {
  const [articles, setArticles] = useState<YnetArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchYnetArticles() {
      try {
        setLoading(true);
        const response = await fetch('/api/ynet');
        
        if (!response.ok) {
          throw new Error('Failed to fetch YNET articles');
        }
        
        const data = await response.json();
        const articlesData = data.articles || [];
        
        // Sort articles by date - newest first
        const sortedArticles = [...articlesData].sort((a, b) => {
          return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        });
        
        setArticles(sortedArticles);
      } catch (err) {
        console.error('Error fetching YNET articles:', err);
        setError('אירעה שגיאה בטעינת המאמרים');
      } finally {
        setLoading(false);
      }
    }

    fetchYnetArticles();
  }, []);

  function formatDate(dateString: string) {
    return format(new Date(dateString), 'dd.MM.yyyy', { locale: he });
  }

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader size="small" text="טוען מאמרים..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg my-6 text-center">
        {error}
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">לא נמצאו מאמרים</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-10">
      <div className="py-6 text-center">
        <h1 className="text-4xl font-bold mb-4 text-[#022E41]">
          הטור של גיא נתן ב-Ynet
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
          הנגשת ידע בתחום הפיננסי להמונים היא הליבה של העשייה שלנו, כאן תוכלו למצוא את כל המאמרים שמתפרסמים בשגרה במדור שוק ההון של Ynet ישראל.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {articles.map((article) => (
          <div
            key={article._id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300 w-full max-w-xl mx-auto"
          >
            <div className="p-3 flex justify-center items-center bg-[#f5f5f7]">
              <img
                src="https://res.cloudinary.com/drld1bejg/image/upload/v1743282916/ynet-capital-logo_k1z4ip.svg"
                alt="YNET Capital"
                className="h-14"
              />
            </div>
            
            <div className="p-8 flex flex-col h-[280px]">
              <h2 className="text-xl font-bold mb-auto text-center leading-tight">
                {article.title}
              </h2>
              
              <div className="flex justify-between items-center mt-6">
                <span className="text-sm text-gray-500">
                  {formatDate(article.publishedAt)}
                </span>
                <a 
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#32a191] text-white px-5 py-2 rounded text-sm hover:bg-[#2a8a7c] transition-colors"
                >
                  קראו עוד
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
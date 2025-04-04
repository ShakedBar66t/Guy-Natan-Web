'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import LogoLoader from '@/components/LogoLoader';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';

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
  externalLink?: string;
};

export default function YnetArticlesPage() {
  const [articles, setArticles] = useState<YnetArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Simulate loading delay (5 seconds) to showcase the loader
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        const res = await fetch('/api/ynet?isPublished=true');
        
        if (!res.ok) {
          throw new Error(`Error fetching articles: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Fetched YNET articles:', data);
        
        // Update articles with externalLink as originalLink if missing
        const updatedArticles = data.map((article: any) => {
          if (!article.originalLink && article.externalLink) {
            article.originalLink = article.externalLink;
          }
          return article;
        });
        
        setArticles(updatedArticles);
      } catch (err) {
        console.error('Failed to fetch articles:', err);
        setError('Failed to fetch articles. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Handler for card clicks
  const handleCardClick = (article: YnetArticle, event: React.MouseEvent) => {
    event.preventDefault();
    const url = article.originalLink || article.externalLink || 'https://www.ynet.co.il';
    console.log('Card clicked:', { 
      title: article.title, 
      navigatingTo: url,
      originalLink: article.originalLink,
      externalLink: article.externalLink
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Handler for "Read More" clicks
  const handleReadMoreClick = (article: YnetArticle, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the card click event from firing
    const url = article.originalLink || article.externalLink || 'https://www.ynet.co.il';
    console.log('Read More clicked:', { 
      title: article.title, 
      navigatingTo: url,
      originalLink: article.originalLink,
      externalLink: article.externalLink
    });
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <MaxWidthWrapper>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">כתבות ידיעות</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              מאמרים וכתבות שפורסמו במדורים השונים באתר ידיעות אחרונות
            </p>
          </div>
        </MaxWidthWrapper>
      </div>

      <MaxWidthWrapper className="py-12">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <LogoLoader />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md text-center">
            {error}
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">אין כתבות להצגה כרגע.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => {
              const articleUrl = article.originalLink || article.externalLink || 'https://www.ynet.co.il';
              console.log(`Article ${article._id}:`, { 
                title: article.title, 
                url: articleUrl,
                originalLink: article.originalLink,
                externalLink: article.externalLink
              });
              
              return (
                <div 
                  key={article._id} 
                  className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-200 relative cursor-pointer transform hover:-translate-y-1"
                  onClick={(e) => handleCardClick(article, e)}
                >
                  {/* Ynet Capital Logo Header */}
                  <div className="relative border-b border-gray-200">
                    <div className="p-3 bg-white flex justify-center">
                      <Image 
                        src="https://res.cloudinary.com/drld1bejg/image/upload/v1743282916/ynet-capital-logo_k1z4ip.svg"
                        alt="YNET Capital"
                        width={180}
                        height={50}
                      />
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-sm text-gray-500 mb-2 flex justify-between">
                      <span>{new Date(article.date).toLocaleDateString('he-IL')}</span>
                      <a 
                        href={articleUrl}
                        onClick={(e) => handleReadMoreClick(article, e)}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-cyan-500 hover:underline relative z-20"
                      >
                        קראו עוד ←
                      </a>
                    </p>
                    <h2 className="text-xl font-bold mb-2">
                      {article.title}
                    </h2>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </MaxWidthWrapper>

      {/* Newsletter Section */}
      <div className="bg-gray-100 py-12">
        <MaxWidthWrapper>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">הישארו מעודכנים</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              הירשמו לניוזלטר שלנו וקבלו עדכונים על כתבות ומאמרים חדשים ישירות לתיבת הדואר
            </p>
            <form className="max-w-md mx-auto flex">
              <input 
                type="email" 
                placeholder="כתובת האימייל שלך" 
                className="flex-grow px-4 py-2 rounded-r-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button 
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-l-md hover:bg-indigo-700 transition-colors"
              >
                הרשמה
              </button>
            </form>
          </div>
        </MaxWidthWrapper>
      </div>
    </>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Link from 'next/link';
import LogoLoader from '@/components/LogoLoader';

// Type for blog posts
type BlogPost = {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  level: string;
  isPublished: boolean;
  slug: string;
  date: string;
  createdAt: string;
  updatedAt: string;
};

// Helper function to generate blog URL structure
function getBlogUrl(post: BlogPost) {
  return `/מאמרים/${post.slug}`;
}

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set document title
    document.title = 'גיא נתן בע״מ - הבלוג שלנו';
    
    const fetchBlogPosts = async () => {
      try {
        // Only fetch published blog posts
        const res = await fetch('/api/blog?isPublished=true');
        
        if (!res.ok) {
          throw new Error(`Error fetching blog posts: ${res.status}`);
        }
        
        const data = await res.json();
        setBlogPosts(data);
      } catch (err) {
        console.error('Failed to fetch blog posts:', err);
        setError('Failed to fetch blog posts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPosts();
  }, []);

  // Get unique categories and levels from the actual data
  const categories = Array.from(new Set(blogPosts.map(post => post.category)));
  const levels = Array.from(new Set(blogPosts.map(post => post.level)));

  // Filter posts based on selection
  const filteredPosts = blogPosts.filter(post => {
    if (selectedCategory && post.category !== selectedCategory) return false;
    if (selectedLevel && post.level !== selectedLevel) return false;
    return true;
  });

  return (
    <>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-800 to-[#002F42] py-12">
        <MaxWidthWrapper>
          <h1 className="text-white text-center text-4xl md:text-5xl font-bold mb-2">
            הבלוג <span className="font-normal">שלנו</span>
          </h1>
        </MaxWidthWrapper>
      </div>

      <MaxWidthWrapper>
        {/* Intro Section */}
        <div className="text-center mb-16">
          <div className="max-w-3xl mx-auto">
            <p className="mb-2 text-lg" dir="rtl">
              אתם רוצים לשנות את העתיד הפיננסי שלכם?<br />
              נמאס לכם לשמוע מושגים ולא להבין מה הם אומרים?<br />
              אתם רוצים ללמוד ולהבין עוד?
            </p>
            <p className="text-xl font-bold text-[#002F42]" dir="rtl">
              הבלוג שלנו זה בדיוק מה שאתם צריכים!
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Category Filter */}
          <div className="bg-gray-100 rounded-lg p-8 text-right" dir="rtl">
            <h2 className="text-3xl font-bold text-[#002F42] mb-6">
              מה בא לך <span className="text-[#32a191]">ללמוד?</span>
            </h2>
            <div className="mb-4">
              <h3 className="text-xl font-medium mb-4">קטגוריה</h3>
              <div className="space-y-3">
                <button 
                  className={`block w-full text-right px-4 py-2 rounded-md ${selectedCategory === null ? 'bg-[#32a191] text-white' : 'bg-white hover:bg-gray-50'}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  הכל
                </button>
                {categories.map((category) => (
                  <button 
                    key={category}
                    className={`block w-full text-right px-4 py-2 rounded-md ${selectedCategory === category ? 'bg-[#32a191] text-white' : 'bg-white hover:bg-gray-50'}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Level Filter */}
          <div className="bg-gray-100 rounded-lg p-8 text-right" dir="rtl">
            <h2 className="text-3xl font-bold text-[#002F42] mb-6">
              מה הרמה <span className="text-[#32a191]">שלך?</span>
            </h2>
            <div className="mb-4">
              <h3 className="text-xl font-medium mb-4">רמה</h3>
              <div className="space-y-3">
                <button 
                  className={`block w-full text-right px-4 py-2 rounded-md ${selectedLevel === null ? 'bg-[#32a191] text-white' : 'bg-white hover:bg-gray-50'}`}
                  onClick={() => setSelectedLevel(null)}
                >
                  הכל
                </button>
                {levels.map((level) => (
                  <button 
                    key={level}
                    className={`block w-full text-right px-4 py-2 rounded-md ${selectedLevel === level ? 'bg-[#32a191] text-white' : 'bg-white hover:bg-gray-50'}`}
                    onClick={() => setSelectedLevel(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <LogoLoader />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-8">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && filteredPosts.length === 0 && (
          <div className="text-center py-16 bg-gray-50 rounded-lg mb-16">
            <p className="text-gray-500 text-lg">עדיין אין מאמרים בקטגוריה זו.</p>
            <button 
              onClick={() => {
                setSelectedCategory(null);
                setSelectedLevel(null);
              }}
              className="mt-4 text-indigo-600 hover:underline"
            >
              הצג את כל המאמרים
            </button>
          </div>
        )}

        {/* Blog Posts Grid */}
        {!isLoading && !error && filteredPosts.length > 0 && (
          <>
            <div className="flex justify-end mb-6">
              <Link 
                href="/admin/dashboard/blog/new"
                className="bg-[#32a191] text-white px-4 py-2 rounded-md hover:bg-[#022E41] transition-colors"
              >
                פרסם מאמר חדש
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredPosts.map((post) => (
                <div key={post._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 h-[450px] md:h-[480px]">
                  {/* Post Content */}
                  <div className="p-6 flex flex-col h-full text-right" dir="rtl">
                    <div className="text-gray-500 text-sm mb-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{new Date(post.date).toLocaleDateString('he-IL')}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-700">{post.level}</span>
                      </div>
                    </div>
                    <div className="overflow-y-auto mb-3 pr-1 custom-scrollbar" style={{ maxHeight: '100px' }}>
                      <h2 className="text-xl font-bold text-[#002F42] hover:text-[#32a191] transition-colors">
                        <Link href={getBlogUrl(post)}>
                          {post.title}
                        </Link>
                      </h2>
                    </div>
                    <div className="overflow-y-auto flex-grow mb-4 pr-1 custom-scrollbar" style={{ maxHeight: '220px', minHeight: '150px' }}>
                      <p className="text-gray-700">{post.excerpt}</p>
                    </div>
                    <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
                      <span className="text-sm text-gray-500">{post.category}</span>
                      <Link 
                        href={getBlogUrl(post)}
                        className="inline-block text-[#32a191] font-medium hover:text-[#002F42] transition-colors"
                      >
                        קרא עוד {'>>'} 
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Newsletter Section */}
        <div className="bg-[#32a191] text-white rounded-lg p-8 mb-16" dir="rtl">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">
              הירשמו לניוזלטר שלנו לקבלת עדכונים על מאמרים חדשים
            </h3>
            <p className="text-lg">
              אל תפספסו את המאמרים האחרונים ועדכונים פיננסיים חשובים
            </p>
          </div>
          <form className="max-w-md mx-auto flex flex-col md:flex-row gap-4">
            <input 
              type="email" 
              placeholder="כתובת דוא״ל"
              required
              dir="rtl"
              className="flex-1 p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button 
              type="submit"
              className="bg-white text-[#32a191] font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              הרשמה
            </button>
          </form>
        </div>
      </MaxWidthWrapper>
    </>
  );
} 
'use client';

import { useState, useEffect, Suspense } from 'react';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Link from 'next/link';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import Glossary from '@/components/Glossary';
import Loader from '@/components/Loader';
import { useSearchParams, useRouter } from 'next/navigation';
import logger from '@/utils/logger';
import ContactForm from "@/components/ContactForm";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  category?: string;
  level?: string;
}

// Client component that uses search params
function BlogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams?.get('tab');
  
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'blog' | 'glossary'>(
    tabParam === 'glossary' ? 'glossary' : 'blog'
  );

  // Update the URL when tab changes
  const handleTabChange = (tab: 'blog' | 'glossary') => {
    setActiveTab(tab);
    
    // Update URL query parameter
    if (searchParams) {
      const params = new URLSearchParams(searchParams.toString());
      if (tab === 'glossary') {
        params.set('tab', 'glossary');
      } else {
        params.delete('tab');
      }
      
      // Replace the URL with new query params
      router.replace(`/blog?${params.toString()}`);
    }
  };

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        setLoading(true);
        const response = await fetch('/api/blog');
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        setBlogPosts(data);
      } catch (err) {
        logger.error('Error fetching blog posts:', err);
        setError('אירעה שגיאה בטעינת המאמרים. נסה שוב מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    }

    fetchBlogPosts();
  }, []);

  // Get unique categories and levels
  const categories = Array.from(new Set(blogPosts.filter(post => post.category).map(post => post.category)));
  const levels = Array.from(new Set(blogPosts.filter(post => post.level).map(post => post.level)));

  // Filter posts based on selection
  const filteredPosts = blogPosts.filter(post => {
    if (selectedCategory && post.category !== selectedCategory) return false;
    if (selectedLevel && post.level !== selectedLevel) return false;
    return true;
  });

  // Format date helper
  function formatDate(dateString: string) {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: he });
  }

  return (
    <>
      {/* Tab switcher */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-100 rounded-full p-1 inline-flex">
          <button
            onClick={() => handleTabChange('blog')}
            className={`px-6 py-2 rounded-full text-lg font-medium ${
              activeTab === 'blog'
                ? 'bg-[#32a191] text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            מאמרים
          </button>
          <button
            onClick={() => handleTabChange('glossary')}
            className={`px-6 py-2 rounded-full text-lg font-medium ${
              activeTab === 'glossary'
                ? 'bg-[#32a191] text-white'
                : 'text-gray-700 hover:bg-gray-200'
            }`}
          >
            מילון מושגים
          </button>
        </div>
      </div>

      {/* Glossary Section */}
      {activeTab === 'glossary' && <Glossary />}

      {/* Blog Content - Only show when blog tab is active */}
      {activeTab === 'blog' && (
        <>
          {/* Filters Section */}
          {categories.length > 0 && (
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
                        onClick={() => setSelectedCategory(category as string)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Level Filter */}
              {levels.length > 0 && (
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
                          onClick={() => setSelectedLevel(level as string)}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && <Loader />}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center mb-16">
              {error}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredPosts.length === 0 && (
            <div className="text-center py-12 mb-16">
              <div className="text-xl text-gray-600">לא נמצאו מאמרים בקטגוריה זו.</div>
              <button 
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedLevel(null);
                }}
                className="mt-4 bg-[#32a191] text-white px-4 py-2 rounded-md"
              >
                הצג את כל המאמרים
              </button>
            </div>
          )}

          {/* Blog Posts Grid */}
          {!loading && filteredPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredPosts.map((post) => (
                <div key={post._id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                  {/* Post Image */}
                  {post.coverImage && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={post.coverImage} 
                        alt={post.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  {/* Post Content */}
                  <div className="p-6 flex flex-col flex-grow text-right" dir="rtl">
                    <h2 className="text-xl font-bold text-[#002F42] mb-4 min-h-[3rem] line-clamp-2 hover:text-[#32a191] transition-colors">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>
                    <div className="mb-4 text-gray-500 text-sm">
                      <span className="inline-block">
                        <span className="font-bold">{post.publishedAt ? formatDate(post.publishedAt) : formatDate(post.createdAt)}</span>
                      </span>
                      {post.category && (
                        <span className="inline-block mr-4">
                          <span className="font-bold">{post.category}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-gray-700 mb-4 flex-grow">{post.excerpt || post.title}</p>
                    <div className="flex justify-start">
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="inline-block text-[#32a191] font-medium hover:text-[#002F42] transition-colors"
                      >
                        קרא עוד {'>>'} 
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}

export default function BlogPage() {
  return (
    <>
      {/* Header Banner */}
      <div className="bg-[#002F42] py-6 mb-8">
        <MaxWidthWrapper>
          <h1 className="text-white text-center text-5xl md:text-6xl font-bold mb-2">
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
        
        {/* Wrap SearchParams usage in Suspense */}
        <Suspense fallback={<Loader />}>
          <BlogContent />
        </Suspense>
      </MaxWidthWrapper>
    </>
  );
} 
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);

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
        setBlogPosts(data.posts || data); // Handle both new and old response format
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

  // Filter posts based on selection and search query
  const filteredPosts = blogPosts.filter(post => {
    // Filter by category
    if (selectedCategory && post.category !== selectedCategory) return false;
    
    // Filter by level
    if (selectedLevel && post.level !== selectedLevel) return false;
    
    // Filter by search query (case insensitive)
    if (searchQuery && !post.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });

  // Format date helper
  function formatDate(dateString: string) {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: he });
  }

  const toggleFilters = () => {
    setIsFilterExpanded(!isFilterExpanded);
  };

  return (
    <>
      {/* Tab switcher */}
      <div className="flex justify-center mb-6">
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
          {/* Search and Filters */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-right" dir="rtl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
              {/* Search input */}
              <div className="relative w-full md:w-1/2">
                <input
                  type="text"
                  placeholder="חיפוש לפי כותרת..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Filters toggle button */}
              <button
                onClick={toggleFilters}
                className="flex items-center text-[#32a191] hover:text-[#002F42] transition-colors text-sm"
              >
                <span className="ml-1 font-medium">מה בא לך ללמוד?</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-transform duration-200 ${isFilterExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {/* Expandable filters */}
            {isFilterExpanded && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 animate-fadeIn">
                {/* Category Filter */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-medium mb-2">קטגוריה</h3>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      className={`px-3 py-1 rounded-md text-sm ${selectedCategory === null ? 'bg-[#32a191] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                      onClick={() => setSelectedCategory(null)}
                    >
                      הכל
                    </button>
                    {categories.map((category) => (
                      <button 
                        key={category}
                        className={`px-3 py-1 rounded-md text-sm ${selectedCategory === category ? 'bg-[#32a191] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        onClick={() => setSelectedCategory(category as string)}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Level Filter - only show if there are levels */}
                {levels.length > 0 && (
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h3 className="text-lg font-medium mb-2">רמה</h3>
                    <div className="flex flex-wrap gap-2">
                      <button 
                        className={`px-3 py-1 rounded-md text-sm ${selectedLevel === null ? 'bg-[#32a191] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        onClick={() => setSelectedLevel(null)}
                      >
                        הכל
                      </button>
                      {levels.map((level) => (
                        <button 
                          key={level}
                          className={`px-3 py-1 rounded-md text-sm ${selectedLevel === level ? 'bg-[#32a191] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                          onClick={() => setSelectedLevel(level as string)}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Loading state */}
          {loading && (
            <div className="text-center py-12 mb-16">
              <Loader text="טוען מאמרים..." />
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="text-center py-12 mb-16">
              <div className="text-red-500 mb-4">{error}</div>
              <button
                onClick={() => window.location.reload()}
                className="bg-[#32a191] text-white px-4 py-2 rounded-md"
              >
                נסה שוב
              </button>
            </div>
          )}

          {/* No results state */}
          {!loading && !error && filteredPosts.length === 0 && (
            <div className="text-center py-12 mb-16">
              <div className="text-xl text-gray-600 mb-4">
                {searchQuery 
                  ? `לא נמצאו מאמרים התואמים לחיפוש "${searchQuery}"`
                  : 'לא נמצאו מאמרים בקטגוריה זו.'}
              </div>
              <button 
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedLevel(null);
                  setSearchQuery('');
                }}
                className="bg-[#32a191] text-white px-4 py-2 rounded-md"
              >
                הצג את כל המאמרים
              </button>
            </div>
          )}

          {/* Blog Posts Grid */}
          {!loading && filteredPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredPosts.map(post => (
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
          
          {/* Contact Form */}
          <ContactForm />
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
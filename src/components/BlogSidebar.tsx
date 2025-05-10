"use client";

// BlogSidebar component - Updated for deployment
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { he } from 'date-fns/locale';
import Loader from './Loader';

// Make.com webhook URL
const WEBHOOK_URL = "https://hook.eu1.make.com/g6x3eo5vakusrt2i1ygtn17445l2xqal";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  publishedAt?: string;
  createdAt: string;
  coverImage?: string;
  category?: string;
}

interface BlogSidebarProps {
  currentPostId?: string;
}

export default function BlogSidebar({ currentPostId }: BlogSidebarProps) {
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    async function fetchRecentPosts() {
      try {
        setLoading(true);
        const response = await fetch('/api/blog?limit=10');
        if (!response.ok) {
          throw new Error('Failed to fetch recent posts');
        }
        const data = await response.json();
        // Filter out the current post if provided
        const filteredPosts = currentPostId 
          ? data.posts.filter((post: BlogPost) => post._id !== currentPostId) 
          : data.posts;
        
        // Limit to 4 posts for the recent posts section
        setRecentPosts(filteredPosts.slice(0, 4));
        
        // Extract unique categories
        const allCategories = filteredPosts
          .filter((post: BlogPost) => post.category)
          .map((post: BlogPost) => post.category as string);
          
        setCategories(Array.from(new Set(allCategories)));
      } catch (err) {
        console.error('Error fetching recent posts:', err);
        setError('אירעה שגיאה בטעינת המאמרים האחרונים');
      } finally {
        setLoading(false);
      }
    }

    fetchRecentPosts();
  }, [currentPostId]);

  // Format date helper
  function formatDate(dateString: string) {
    return format(new Date(dateString), 'dd/MM/yyyy', { locale: he });
  }
  
  // Handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Send form data to the webhook
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source: 'blog_sidebar',
          timestamp: new Date().toISOString(),
          postId: currentPostId
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      setFormSuccess(true);
      setFormData({ name: '', phone: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setFormSuccess(false);
      }, 5000);
      
    } catch (err) {
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6" dir="rtl">
      {/* Contact Form Section - Moved to top */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-[#002F42] mb-3">רוצים לשמוע פרטים נוספים או להתחיל את התהליך? השאירו פרטים</h3>
        
        {formSuccess ? (
          <div className="bg-green-50 text-green-700 p-3 rounded-md text-center">
            פרטיך נשלחו בהצלחה! נחזור אליך בהקדם
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="flex flex-col space-y-2">
            <input
              type="text"
              name="name"
              placeholder="שם מלא"
              value={formData.name}
              onChange={handleFormChange}
              required
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#32a191]"
              dir="rtl"
            />
            <input
              type="tel"
              name="phone"
              placeholder="טלפון"
              value={formData.phone}
              onChange={handleFormChange}
              required
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#32a191]"
              dir="rtl"
            />
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-[#002F42] text-white py-2 rounded-md hover:bg-[#32a191] transition-colors disabled:opacity-70"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <Loader size="small" type="spinner" text={null} className="ml-2" />
                  שולח...
                </div>
              ) : (
                'שליחה'
              )}
            </button>
          </form>
        )}
      </div>
      
      {/* Recent Posts Section */}
      <div className="mb-10">
        <h3 className="text-xl font-bold text-[#002F42] mb-4 border-b border-gray-200 pb-2">מאמרים נוספים</h3>
        
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader size="small" text="טוען מאמרים..." />
          </div>
        ) : error ? (
          <p className="text-red-500 text-sm">{error}</p>
        ) : recentPosts.length === 0 ? (
          <p className="text-gray-500 text-sm">אין מאמרים נוספים להצגה</p>
        ) : (
          <div className="space-y-4">
            {recentPosts.map(post => (
              <Link key={post._id} href={`/blog/${post.slug}`}>
                <div className="group flex items-start hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  {post.coverImage && (
                    <div className="rounded overflow-hidden flex-shrink-0 w-16 h-16 mr-3">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-[#002F42] group-hover:text-[#32a191] transition-colors">
                      {post.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {post.publishedAt 
                        ? formatDate(post.publishedAt) 
                        : formatDate(post.createdAt)
                      }
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        <div className="mt-4 text-center">
          <Link 
            href="/blog"
            className="inline-block text-[#32a191] font-medium hover:text-[#002F42] transition-colors"
          >
            לכל המאמרים {'>'}
          </Link>
        </div>
      </div>
      
      {/* Categories Section */}
      {categories.length > 0 && (
        <div className="mb-10">
          <h3 className="text-xl font-bold text-[#002F42] mb-4 border-b border-gray-200 pb-2">קטגוריות</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Link 
                key={category} 
                href={`/blog?category=${encodeURIComponent(category)}`}
              >
                <span className="inline-block bg-gray-100 hover:bg-gray-200 text-[#002F42] px-3 py-2 rounded-md text-sm transition-colors">
                  {category}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 
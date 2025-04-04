'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

type BlogPost = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  level: string;
  isPublished: boolean;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export default function BlogPostsPage() {
  const router = useRouter();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/blog');
        
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

  const handleDeletePost = async (id: string) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק מאמר זה?')) {
      try {
        const res = await fetch(`/api/blog/${id}`, {
          method: 'DELETE',
        });

        if (!res.ok) {
          throw new Error(`Error deleting blog post: ${res.status}`);
        }

        // Filter out the deleted post
        setBlogPosts(blogPosts.filter((post) => post._id !== id));
        toast.success('המאמר נמחק בהצלחה');
      } catch (err) {
        console.error('Failed to delete blog post:', err);
        toast.error('שגיאה במחיקת המאמר');
      }
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/blog/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublished: !currentStatus,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error updating blog post: ${res.status}`);
      }

      // Update the post status in the UI
      setBlogPosts(
        blogPosts.map((post) =>
          post._id === id ? { ...post, isPublished: !currentStatus } : post
        )
      );

      toast.success(
        `המאמר ${!currentStatus ? 'פורסם' : 'הוסר מפרסום'} בהצלחה`
      );
    } catch (err) {
      console.error('Failed to update blog post:', err);
      toast.error('שגיאה בעדכון סטטוס המאמר');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">ניהול מאמרים</h1>
        <Link
          href="/admin/dashboard/blog/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          מאמר חדש
        </Link>
      </div>

      {blogPosts.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-gray-500 mb-4">אין מאמרים עדיין.</p>
          <Link
            href="/admin/dashboard/blog/new"
            className="text-indigo-600 hover:underline"
          >
            צור את המאמר הראשון שלך
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  כותרת
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  קטגוריה
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  רמה
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  סטטוס
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  תאריך
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  פעולות
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogPosts.map((post) => (
                <tr key={post._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {post.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{post.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{post.level}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        post.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {post.isPublished ? 'מפורסם' : 'טיוטה'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(post.date || post.createdAt).toLocaleDateString('he-IL')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2 rtl:space-x-reverse">
                      <button
                        onClick={() => handleTogglePublish(post._id, post.isPublished)}
                        className={`${
                          post.isPublished
                            ? 'text-yellow-600 hover:text-yellow-800'
                            : 'text-green-600 hover:text-green-800'
                        }`}
                      >
                        {post.isPublished ? 'בטל פרסום' : 'פרסם'}
                      </button>
                      <span className="text-gray-300">|</span>
                      <Link
                        href={`/admin/dashboard/blog/${post._id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        ערוך
                      </Link>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        מחק
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 
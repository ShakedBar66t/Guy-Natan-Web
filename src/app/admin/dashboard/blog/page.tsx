'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export default function BlogManagement() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  async function fetchBlogPosts() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/blog');
      
      if (!response.ok) {
        throw new Error('Failed to fetch blog posts');
      }
      
      const data = await response.json();
      setBlogPosts(data);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('טעינת המאמרים נכשלה');
    } finally {
      setLoading(false);
    }
  }

  async function handlePublishToggle(id: string, currentStatus: boolean) {
    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          isPublished: !currentStatus,
          publishedAt: !currentStatus ? new Date().toISOString() : undefined
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update post');
      }
      
      // Refresh the list
      fetchBlogPosts();
    } catch (err) {
      console.error('Error updating blog post:', err);
      setError('עדכון המאמר נכשל');
    }
  }

  async function handleDelete(id: string) {
    // First click sets the ID (confirmation step)
    if (deleteId !== id) {
      setDeleteId(id);
      return;
    }
    
    // Second click performs the delete
    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      
      // Refresh the list
      fetchBlogPosts();
      setDeleteId(null);
    } catch (err) {
      console.error('Error deleting blog post:', err);
      setError('מחיקת המאמר נכשלה');
    }
  }

  function formatDate(dateString: string) {
    return format(new Date(dateString), 'dd/MM/yyyy');
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg font-medium text-gray-600">טוען מאמרים...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold">מאמרים</h2>
        <Link
          href="/admin/dashboard/blog/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          מאמר חדש
        </Link>
      </div>
      
      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      
      {blogPosts.length === 0 ? (
        <div className="rounded-lg bg-white p-6 text-center shadow-sm">
          <p className="text-gray-500">לא נמצאו מאמרים</p>
          <Link
            href="/admin/dashboard/blog/new"
            className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            צור את המאמר הראשון שלך
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  כותרת
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  סטטוס
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  נוצר
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  עודכן
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  פעולות
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {blogPosts.map((post) => (
                <tr key={post._id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{post.title}</div>
                    <div className="text-sm text-gray-500">{post.slug}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      post.isPublished 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.isPublished ? 'פורסם' : 'טיוטה'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatDate(post.updatedAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/dashboard/blog/edit/${post._id}`}
                        className="text-blue-600 hover:text-blue-900 ml-2"
                      >
                        ערוך
                      </Link>
                      <button
                        onClick={() => handlePublishToggle(post._id, post.isPublished)}
                        className={`${
                          post.isPublished 
                            ? 'text-yellow-600 hover:text-yellow-900' 
                            : 'text-green-600 hover:text-green-900'
                        } ml-2`}
                      >
                        {post.isPublished ? 'בטל פרסום' : 'פרסם'}
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className={`${
                          deleteId === post._id
                            ? 'text-red-800 font-bold'
                            : 'text-red-600 hover:text-red-900'
                        } ml-2`}
                      >
                        {deleteId === post._id ? 'אישור מחיקה' : 'מחק'}
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
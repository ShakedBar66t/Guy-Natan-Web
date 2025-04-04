'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { BiEdit, BiTrash } from 'react-icons/bi';
import { HiOutlineExternalLink } from 'react-icons/hi';
import { format } from 'date-fns';

type YnetArticle = {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  date: string;
  isPublished: boolean;
  originalLink: string;
};

export default function YnetDashboardPage() {
  const [articles, setArticles] = useState<YnetArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/ynet');
      
      if (!res.ok) {
        throw new Error(`Error fetching articles: ${res.status}`);
      }
      
      const data = await res.json();
      setArticles(data);
    } catch (err) {
      console.error('Failed to fetch articles:', err);
      setError('Failed to fetch articles. Please try again later.');
      toast.error('שגיאה בטעינת כתבות ידיעות');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את הכתבה?')) {
      return;
    }

    try {
      const res = await fetch(`/api/ynet/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error(`Error deleting article: ${res.status}`);
      }

      toast.success('הכתבה נמחקה בהצלחה');
      fetchArticles(); // Refresh the list
    } catch (err) {
      console.error('Failed to delete article:', err);
      toast.error('שגיאה במחיקת הכתבה');
    }
  };

  const handleTogglePublish = async (article: YnetArticle) => {
    try {
      const res = await fetch(`/api/ynet/${article._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...article,
          isPublished: !article.isPublished,
        }),
      });

      if (!res.ok) {
        throw new Error(`Error updating article: ${res.status}`);
      }

      toast.success(`הכתבה ${article.isPublished ? 'הוסרה מפרסום' : 'פורסמה'} בהצלחה`);
      fetchArticles(); // Refresh the list
    } catch (err) {
      console.error('Failed to update article:', err);
      toast.error('שגיאה בעדכון הכתבה');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">ניהול כתבות ידיעות</h1>
        <Link
          href="/admin/dashboard/ynet/new"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          כתבה חדשה
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
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
                  תאריך
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
                  קישור מקורי
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  פעולות
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles.length === 0 ? (
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center" colSpan={5}>
                    אין כתבות להצגה
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {article.title.length > 60 ? article.title.substring(0, 60) + '...' : article.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {article.date ? new Date(article.date).toLocaleDateString('he-IL') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleTogglePublish(article)}
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          article.isPublished
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {article.isPublished ? 'מפורסם' : 'טיוטה'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {article.originalLink ? (
                        <a 
                          href={article.originalLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-900 flex items-center"
                        >
                          צפייה במקור <HiOutlineExternalLink className="mr-1 ml-1" />
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2 space-x-reverse">
                      <Link
                        href={`/admin/dashboard/ynet/${article._id}`}
                        className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                      >
                        <BiEdit className="ml-1" /> עריכה
                      </Link>
                      <button
                        onClick={() => handleDelete(article._id)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center mr-3"
                      >
                        <BiTrash className="ml-1" /> מחיקה
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 
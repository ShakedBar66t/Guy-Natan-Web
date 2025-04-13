'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import { format } from 'date-fns';

interface YnetArticle {
  _id: string;
  title: string;
  link: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export default function YnetManagementPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<YnetArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/ynet');
      if (!response.ok) {
        throw new Error('Failed to fetch Ynet articles');
      }
      const data = await response.json();
      setArticles(data);
    } catch (err) {
      console.error('Error fetching Ynet articles:', err);
      setError('אירעה שגיאה בטעינת הכתבות. נסה שוב מאוחר יותר.');
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק כתבה זו?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/ynet/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete article');
      }

      // Remove the deleted article from the state
      setArticles(articles.filter(article => article._id !== id));
      setSuccess('הכתבה נמחקה בהצלחה');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      console.error('Error deleting article:', err);
      setError('אירעה שגיאה במחיקת הכתבה');
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd.MM.yyyy');
    } catch (error) {
      return 'תאריך לא תקין';
    }
  };

  return (
    <div className="p-6" dir="rtl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">ניהול כתבות Ynet</h1>
        <button
          onClick={() => router.push('/admin/dashboard/ynet/new')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          הוסף כתבה חדשה
        </button>
      </div>
      
      {/* Success message */}
      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6">
          {success}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <Loader size="medium" />
      ) : articles.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <p className="text-lg text-gray-600 mb-4">
            עדיין אין כתבות Ynet.
          </p>
          <button
            onClick={() => router.push('/admin/dashboard/ynet/new')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            הוסף את הכתבה הראשונה
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  כותרת
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  תאריך פרסום
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  תאריך הוספה
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  פעולות
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {articles.map((article) => (
                <tr key={article._id}>
                  <td className="px-6 py-4 whitespace-normal">
                    <div className="text-sm font-medium text-gray-900">
                      {article.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(article.publishedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(article.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                    <button
                      onClick={() => router.push(`/admin/dashboard/ynet/edit/${article._id}`)}
                      className="text-indigo-600 hover:text-indigo-900 ml-3"
                    >
                      ערוך
                    </button>
                    <button
                      onClick={() => handleDelete(article._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      מחק
                    </button>
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
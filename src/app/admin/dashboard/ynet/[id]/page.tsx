'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

type YnetArticle = {
  _id: string;
  title: string;
  slug: string;
  date: string;
  isPublished: boolean;
  originalLink: string;
  externalLink?: string;
  content?: string;
  excerpt?: string;
};

export default function EditYnetArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<YnetArticle>>({
    title: '',
    originalLink: '',
    date: '',
    isPublished: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`/api/ynet/${params.id}`);
        
        if (!res.ok) {
          throw new Error(`Error fetching article: ${res.status}`);
        }
        
        const article = await res.json();
        
        // Set originalLink from externalLink if present
        if (article.externalLink && !article.originalLink) {
          article.originalLink = article.externalLink;
        }
        
        // Convert date format if needed (from DD.MM.YYYY to YYYY-MM-DD for the input)
        if (article.date && article.date.includes('.')) {
          const dateParts = article.date.split('.');
          if (dateParts.length === 3) {
            article.date = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
          }
        }
        
        setFormData(article);
      } catch (err) {
        console.error('Failed to fetch article:', err);
        setError('Failed to fetch article. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticle();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Convert date from YYYY-MM-DD back to DD.MM.YYYY for storage
      let formattedData = { ...formData };
      
      if (formData.date && formData.date.includes('-')) {
        const dateParts = formData.date.split('-');
        formattedData.date = `${dateParts[2]}.${dateParts[1]}.${dateParts[0]}`;
      }
      
      // Set externalLink from originalLink while preserving originalLink
      if (formData.originalLink) {
        formattedData.externalLink = formData.originalLink;
      }
      
      // Set empty content and excerpt
      formattedData.content = '';
      formattedData.excerpt = '';
      
      const res = await fetch(`/api/ynet/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });

      if (!res.ok) {
        throw new Error(`Error updating article: ${res.status}`);
      }

      toast.success('הכתבה עודכנה בהצלחה!');
      router.push('/admin/dashboard/ynet');
    } catch (err) {
      console.error('Failed to update article:', err);
      toast.error('שגיאה בעדכון הכתבה');
    } finally {
      setIsSubmitting(false);
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
        <div className="mt-4">
          <Link href="/admin/dashboard/ynet" className="text-indigo-600 hover:underline">
            חזרה לרשימת הכתבות
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">עריכת כתבה</h1>
        <Link
          href="/admin/dashboard/ynet"
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          חזרה
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              כותרת
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              תאריך
            </label>
            <input
              type="date"
              id="date"
              name="date"
              required
              value={formData.date || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="originalLink" className="block text-sm font-medium text-gray-700">
              קישור מקורי
            </label>
            <input
              type="url"
              id="originalLink"
              name="originalLink"
              required
              value={formData.originalLink || ''}
              onChange={handleChange}
              placeholder="https://www.ynet.co.il/article/..."
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center">
            <input
              id="isPublished"
              name="isPublished"
              type="checkbox"
              checked={formData.isPublished || false}
              onChange={handleCheckbox}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublished" className="mr-2 block text-sm text-gray-700">
              פרסם
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/admin/dashboard/ynet')}
              className="mr-4 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? 'שומר...' : 'שמור שינויים'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 
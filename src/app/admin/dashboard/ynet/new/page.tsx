'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function NewYnetArticlePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    originalLink: '',
    date: new Date().toISOString().split('T')[0], // Default to today's date
    isPublished: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    setError(null);

    try {
      console.log('Submitting form data:', formData);
      
      const res = await fetch('/api/ynet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // Set empty string for fields we're removing but might be required by API
          excerpt: '',
          content: '',
          externalLink: formData.originalLink, // Map to the correct field name
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || `Error creating YNET article: ${res.status}`);
      }

      console.log('YNET article created:', data);
      toast.success('הכתבה נוצרה בהצלחה!');
      router.push('/admin/dashboard/ynet');
    } catch (err: any) {
      console.error('Failed to create YNET article:', err);
      setError(err.message || 'שגיאה ביצירת הכתבה');
      toast.error(err.message || 'שגיאה ביצירת הכתבה');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">כתבה חדשה</h1>
        <Link
          href="/admin/dashboard/ynet"
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          חזרה
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p className="font-bold">שגיאה:</p>
          <p>{error}</p>
        </div>
      )}

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
              value={formData.title}
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
              value={formData.date}
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
              value={formData.originalLink}
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
              checked={formData.isPublished}
              onChange={handleCheckbox}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublished" className="mr-2 block text-sm text-gray-700">
              פרסם מיד
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
              {isSubmitting ? 'שומר...' : 'שמור'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
} 
'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Loader from './Loader';

interface YnetArticle {
  _id?: string;
  title: string;
  link: string;
  slug?: string;
  publishedAt: string;
}

interface YnetArticleEditorProps {
  article?: YnetArticle;
  isEditing?: boolean;
}

export default function YnetArticleEditor({ article, isEditing = false }: YnetArticleEditorProps) {
  const router = useRouter();
  
  const [formData, setFormData] = useState<YnetArticle>({
    title: article?.title || '',
    link: article?.link || '',
    slug: article?.slug || '',
    publishedAt: article?.publishedAt ? format(new Date(article.publishedAt), "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Auto-generate slug when title changes
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\sא-ת]/g, '') // Keep Hebrew characters and alphanumerics
        .replace(/\s+/g, '-') // Replace spaces with dashes
        .trim();
      
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Validate the link to ensure it's a valid Ynet URL
      if (!formData.link.includes('ynet.co.il')) {
        throw new Error('יש להזין קישור תקין לכתבה ב-Ynet');
      }
      
      // Create a new object to send to the API
      const apiData = {
        ...formData,
        // Convert the date string to a Date object
        publishedAt: new Date(formData.publishedAt).toISOString()
      };
      
      // Generate slug from title and add timestamp to ensure uniqueness
      apiData.slug = formData.title
        .toLowerCase()
        .replace(/[^\w\sא-ת]/g, '')
        .replace(/\s+/g, '-')
        .trim();
        
      // Add timestamp to ensure uniqueness
      apiData.slug = `${apiData.slug}-${Date.now()}`;
      
      const url = isEditing && article?._id 
        ? `/api/admin/ynet/${article._id}` 
        : '/api/admin/ynet';
      
      const method = isEditing ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'משהו השתבש');
      }
      
      setSuccess(isEditing ? 'הכתבה עודכנה בהצלחה!' : 'הכתבה נוספה בהצלחה!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/admin/dashboard/ynet');
      }, 1500);
    } catch (err) {
      console.error('Error saving Ynet article:', err);
      setError(String(err) || 'משהו השתבש');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm" dir="rtl">
      <h2 className="text-xl font-bold">{isEditing ? 'עריכת כתבה' : 'הוספת כתבה חדשה'}</h2>
      
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      
      {success && (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            כותרת הכתבה
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-700">
            קישור לכתבה ב-Ynet
          </label>
          <input
            type="url"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            required
            placeholder="https://www.ynet.co.il/..."
          />
          <p className="mt-1 text-sm text-gray-500">
            הזן קישור מלא כולל https://
          </p>
        </div>
        
        <div>
          <label htmlFor="publishedAt" className="block text-sm font-medium text-gray-700">
            תאריך פרסום
          </label>
          <input
            type="datetime-local"
            id="publishedAt"
            name="publishedAt"
            value={formData.publishedAt}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard/ynet')}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ml-3"
          >
            ביטול
          </button>
          <button
            type="submit"
            className={`px-6 py-2 rounded-md text-white font-medium ${
              formData.title && formData.link
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={loading || !formData.title || !formData.link}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <Loader text={null} size="small" className="my-0" />
              </div>
            ) : (
              isEditing ? 'עדכן כתבה' : 'הוסף כתבה'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 
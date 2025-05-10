'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loader from './Loader';
import HebrewEditor from './HebrewEditor';
import TinyMCEEditor from './TinyMCEEditor';

interface FinancialTerm {
  _id: string;
  term: string;
  slug: string;
}

interface BlogPost {
  _id?: string;
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  isPublished: boolean;
  scheduledPublishDate?: string; // ISO string format for datetime-local input
  category?: string;
  level?: string;
  relatedTerms?: string[];
}

interface BlogEditorProps {
  post?: BlogPost;
  isEditing?: boolean;
}

// Pre-defined categories and levels
const CATEGORIES = ['פיננסים', 'השקעות', 'כלכלה', 'כלכלה אישית', 'כללי'];
const LEVELS = ['מתחילים', 'בינוניים', 'מתקדמים'];

export default function BlogEditor({ post, isEditing = false }: BlogEditorProps) {
  const router = useRouter();
  const editorRef = useRef<any>(null);
  
  // Using a hardcoded API key for consistency
  const API_KEY = 'l9jp7dztnnrgwndr7c2jgmuo1qxht4324yt0p53g0qlfby1w';
  
  const [formData, setFormData] = useState<BlogPost>({
    title: post?.title || '',
    content: post?.content || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    coverImage: post?.coverImage || '',
    isPublished: post?.isPublished || false,
    scheduledPublishDate: post?.scheduledPublishDate ? new Date(post.scheduledPublishDate).toISOString().slice(0, 16) : '',
    category: post?.category || '',
    level: post?.level || '',
    relatedTerms: post?.relatedTerms || [],
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [terms, setTerms] = useState<FinancialTerm[]>([]);
  const [termsLoading, setTermsLoading] = useState(false);
  const [useRichEditor, setUseRichEditor] = useState(true);

  // Fetch glossary terms for the selector
  useEffect(() => {
    async function fetchTerms() {
      try {
        setTermsLoading(true);
        const response = await fetch('/api/glossary');
        if (!response.ok) {
          throw new Error('Failed to fetch glossary terms');
        }
        const data = await response.json();
        setTerms(data);
      } catch (err) {
        console.error('Error fetching glossary terms:', err);
      } finally {
        setTermsLoading(false);
      }
    }

    fetchTerms();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleTermSelection = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      relatedTerms: selectedOptions
    }));
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      setFormData((prev) => ({
        ...prev,
        content: editorRef.current.getContent(),
      }));
    }
  };

  const isScheduledDateValid = () => {
    if (!formData.scheduledPublishDate) return true;
    
    const scheduledDate = new Date(formData.scheduledPublishDate);
    const now = new Date();
    
    return scheduledDate > now;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    if (formData.scheduledPublishDate && !isScheduledDateValid()) {
      setError('זמן הפרסום המתוזמן חייב להיות בעתיד');
      setLoading(false);
      return;
    }
    
    try {
      const content = editorRef.current ? editorRef.current.getContent() : formData.content;
      
      // Generate slug automatically from title for both new and edited posts
      const titleSlug = formData.title
        .toLowerCase()
        .replace(/[^\w\s-]/gi, '') // Remove special chars except hyphens
        .replace(/\s+/g, '-')      // Replace spaces with dashes
        .replace(/-+/g, '-')       // Replace multiple hyphens with a single one
        .replace(/^-|-$/g, '');    // Trim leading/trailing hyphens

      // For new posts, we'll let the server add timestamp to the slug
      // For edited posts, we'll use the existing slug if available or generate a new one
      const slug = isEditing && post?.slug ? post.slug : titleSlug;
      
      const postData = { 
        ...formData, 
        content,
        slug 
      };
      
      if (formData.scheduledPublishDate && !formData.isPublished) {
        postData.isPublished = false;
        
        const scheduledDate = new Date(formData.scheduledPublishDate);
        postData.scheduledPublishDate = scheduledDate.toISOString();
      } else if (formData.isPublished) {
        postData.scheduledPublishDate = '';
      }
      
      const url = isEditing && post?._id 
        ? `/api/admin/blog/${post._id}` 
        : '/api/admin/blog';
      
      const method = isEditing ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'משהו השתבש');
      }
      
      const data = await response.json();
      
      const successMessage = isEditing ? 'המאמר עודכן בהצלחה!' : 'המאמר נוצר בהצלחה!';
      const scheduledMessage = formData.scheduledPublishDate && !formData.isPublished ? 
        ` הוא יפורסם אוטומטית ב-${new Date(formData.scheduledPublishDate).toLocaleString('he-IL')}` : '';
      
      setSuccess(successMessage + scheduledMessage);
      
      setTimeout(() => {
        router.push('/admin/dashboard/blog');
      }, 1500);
    } catch (err) {
      console.error('Error saving blog post:', err);
      setError(String(err) || 'משהו השתבש');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm" dir="rtl">
      <h2 className="text-xl font-bold">{isEditing ? 'עריכת מאמר' : 'יצירת מאמר חדש'}</h2>
      
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
            כותרת
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
        
        <div className="flex flex-col md:flex-row md:space-x-4 md:space-x-reverse">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              סטטוס פרסום
            </label>
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="isPublished"
                  checked={formData.isPublished}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="mr-2 text-sm text-gray-700">פרסם מיד</span>
              </label>
            </div>
          </div>
        </div>
        
        {/* Scheduled publishing date picker */}
        <div className={formData.isPublished ? "opacity-50 pointer-events-none" : ""}>
          <label htmlFor="scheduledPublishDate" className="block text-sm font-medium text-gray-700">
            תאריך ושעת פרסום מתוזמן
          </label>
          <div className="mt-1">
            <input
              type="datetime-local"
              id="scheduledPublishDate"
              name="scheduledPublishDate"
              value={formData.scheduledPublishDate || ''}
              onChange={handleChange}
              min={new Date().toISOString().slice(0, 16)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              disabled={formData.isPublished}
            />
          </div>
          <p className="mt-1 text-sm text-gray-500">
            השאר ריק לשמירת טיוטה, או בחר תאריך ושעה לפרסום אוטומטי
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              קטגוריה
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="">בחר קטגוריה</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700">
              רמה
            </label>
            <select
              id="level"
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="">בחר רמה</option>
              {LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="relatedTerms" className="block text-sm font-medium text-gray-700">
            מושגים קשורים
          </label>
          {termsLoading ? (
            <div className="mt-1 py-2">
              <Loader text="טוען מושגים..." size="small" />
            </div>
          ) : (
            <select
              id="relatedTerms"
              name="relatedTerms"
              value={formData.relatedTerms}
              onChange={handleTermSelection}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              multiple
              size={5}
            >
              {terms.map((term) => (
                <option key={term._id} value={term._id}>
                  {term.term}
                </option>
              ))}
            </select>
          )}
          <p className="mt-1 text-sm text-gray-500">
            לחץ על Ctrl/⌘ כדי לבחור מספר מושגים
          </p>
        </div>
        
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
            תקציר
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            rows={3}
            value={formData.excerpt}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            תוכן
          </label>
          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={useRichEditor}
                onChange={(e) => setUseRichEditor(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="mr-2 text-gray-700">עורך עשיר</span>
            </label>
          </div>
          {useRichEditor ? (
            <TinyMCEEditor
              initialContent={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              height="500px"
            />
          ) : (
            <HebrewEditor
              initialValue={formData.content}
              onChange={(content) => setFormData(prev => ({ ...prev, content }))}
              height="500px"
            />
          )}
        </div>
        
        <div className="flex justify-end">
          <button
            type="button"
            className="mr-4 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={() => router.push('/admin/dashboard/blog')}
          >
            ביטול
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {loading ? (
              <>
                <Loader size="small" text={null} className="mr-2" type="spinner" />
                <span>שומר...</span>
              </>
            ) : (
              <span>{isEditing ? 'עדכן מאמר' : 'צור מאמר'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 
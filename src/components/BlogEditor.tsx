'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { useRouter } from 'next/navigation';
import Loader from './Loader';

interface BlogPost {
  _id?: string;
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  isPublished: boolean;
  category?: string;
  level?: string;
}

interface BlogEditorProps {
  post?: BlogPost;
  isEditing?: boolean;
}

// Pre-defined categories and levels
const CATEGORIES = ['שוק ההון', 'פיננסים', 'כלכלה', 'נדל"ן', 'ביטוח', 'משפט', 'כללי'];
const LEVELS = ['מתחילים', 'בינוניים', 'מתקדמים'];

export default function BlogEditor({ post, isEditing = false }: BlogEditorProps) {
  const router = useRouter();
  const editorRef = useRef<any>(null);
  
  // Get the API key - fallback to a hardcoded value if env var is not available
  const API_KEY = process.env.NEXT_PUBLIC_TINYMCE_API_KEY || 'l9jp7dztnnrgwndr7c2jgmuo1qxht4324yt0p53g0qlfby1w';
  
  const [formData, setFormData] = useState<BlogPost>({
    title: post?.title || '',
    content: post?.content || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    coverImage: post?.coverImage || '',
    isPublished: post?.isPublished || false,
    category: post?.category || '',
    level: post?.level || '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      setFormData((prev) => ({
        ...prev,
        content: editorRef.current.getContent(),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Make sure to get the latest content from TinyMCE
      const content = editorRef.current ? editorRef.current.getContent() : formData.content;
      const postData = { ...formData, content };
      
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
      
      setSuccess(isEditing ? 'המאמר עודכן בהצלחה!' : 'המאמר נוצר בהצלחה!');
      
      // Redirect after a short delay
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

  const handleGenerateSlug = () => {
    if (!formData.title) return;
    
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    setFormData((prev) => ({ ...prev, slug }));
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
          <div className="flex-1 mb-4 md:mb-0">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={handleGenerateSlug}
                className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                צור אוטומטית
              </button>
            </div>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              סטטוס
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
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
            תקציר
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700">
            כתובת URL של תמונת שער
          </label>
          <input
            type="text"
            id="coverImage"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            תוכן
          </label>
          <div className="mt-1">
            <Editor
              apiKey={API_KEY}
              onInit={(evt, editor) => editorRef.current = editor}
              initialValue={formData.content}
              onEditorChange={handleEditorChange}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount', 'directionality'
                ],
                toolbar: 'undo redo | blocks | bold italic forecolor | ' +
                  'alignleft aligncenter alignright alignjustify | ' +
                  'bullist numlist outdent indent | removeformat | help | ltr rtl',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                directionality: 'rtl',
                readonly: false,
                promotion: false,
              }}
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard/blog')}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ml-3"
          >
            ביטול
          </button>
          <button
            type="submit"
            className={`px-6 py-2 rounded-md text-white font-medium ${
              formData.title && formData.content
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
            disabled={loading || !formData.title || !formData.content}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <Loader text={null} size="small" className="my-0" />
              </div>
            ) : (
              isEditing ? 'עדכן מאמר' : 'צור מאמר'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 
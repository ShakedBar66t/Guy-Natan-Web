'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Editor } from '@tinymce/tinymce-react';

// Sample categories and levels - you can replace these with actual data from your API
const categories = ['השקעות', 'חיסכון', 'פנסיה', 'משכנתאות', 'מיסוי', 'כלכלה'];
const levels = ['מתחילים', 'מתקדמים', 'מומחים'];

type BlogPost = {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  level: string;
  isPublished: boolean;
  slug: string;
  date: string;
  featuredImage?: string;
};

export default function EditBlogPostPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    level: '',
    isPublished: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const res = await fetch(`/api/blog/${params.id}`);
        
        if (!res.ok) {
          throw new Error(`Error fetching blog post: ${res.status}`);
        }
        
        const post = await res.json();
        setFormData(post);
      } catch (err) {
        console.error('Failed to fetch blog post:', err);
        setError('Failed to fetch blog post. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogPost();
  }, [params.id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditorChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/blog/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error(`Error updating blog post: ${res.status}`);
      }

      toast.success('המאמר עודכן בהצלחה!');
      
      // Redirect to the updated blog post
      const updatedPost = await res.json();
      if (updatedPost.slug) {
        router.push(`/blog/${updatedPost.slug}`);
      } else {
        router.push('/admin/dashboard/blog');
      }
    } catch (err) {
      console.error('Failed to update blog post:', err);
      toast.error('שגיאה בעדכון המאמר');
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
          <Link href="/admin/dashboard/blog" className="text-indigo-600 hover:underline">
            חזרה לרשימת המאמרים
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">עריכת מאמר</h1>
        <Link
          href="/admin/dashboard/blog"
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
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
              תקציר
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              required
              value={formData.excerpt || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              תוכן
            </label>
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
              value={formData.content || ''}
              onEditorChange={handleEditorChange}
              init={{
                height: 400,
                menubar: true,
                directionality: 'rtl',
                plugins: [
                  'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                  'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                  'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                ],
                toolbar:
                  'undo redo | blocks | bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | link image media | help',
                image_title: true,
                automatic_uploads: true,
                file_picker_types: 'image',
                file_picker_callback: function (cb: (url: string, obj?: { title: string }) => void, value: string, meta: any) {
                  const input = document.createElement('input');
                  input.setAttribute('type', 'file');
                  input.setAttribute('accept', 'image/*');

                  input.onchange = function () {
                    const file = (input.files as FileList)[0];

                    const reader = new FileReader();
                    reader.onload = function () {
                      const id = 'blobid' + (new Date()).getTime();
                      const blobCache = (window as any).tinymce.activeEditor.editorUpload.blobCache;
                      const base64 = (reader.result as string).split(',')[1];
                      const blobInfo = blobCache.create(id, file, base64);
                      blobCache.add(blobInfo);

                      cb(blobInfo.blobUri(), { title: file.name });
                    };
                    reader.readAsDataURL(file);
                  };

                  input.click();
                },
                content_style: 'body { font-family:Arial,Helvetica,sans-serif; font-size:14px }',
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                קטגוריה
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category || ''}
                onChange={handleChange}
                className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">בחר קטגוריה</option>
                {categories.map((category) => (
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
                required
                value={formData.level || ''}
                onChange={handleChange}
                className="mt-1 block w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">בחר רמה</option>
                {levels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug (URL)
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug || ''}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="generated-automatically-if-empty"
            />
            <p className="mt-1 text-xs text-gray-500">אם ריק, ייווצר אוטומטית מהכותרת.</p>
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
              פרסם עכשיו
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/admin/dashboard/blog')}
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
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import YnetArticleEditor from '@/components/YnetArticleEditor';
import Loader from '@/components/Loader';

interface YnetArticle {
  _id: string;
  title: string;
  link: string;
  publishedAt: string;
}

export default function EditYnetArticlePage() {
  const params = useParams();
  const id = params.id as string;

  const [article, setArticle] = useState<YnetArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      try {
        setLoading(true);
        const response = await fetch(`/api/admin/ynet/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch article');
        }
        
        const data = await response.json();
        setArticle(data);
      } catch (err) {
        console.error('Error fetching article:', err);
        setError('אירעה שגיאה בטעינת הכתבה');
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchArticle();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center">
        <Loader size="medium" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 p-4 rounded-lg text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="p-6">
        <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700">
          הכתבה לא נמצאה
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <YnetArticleEditor article={article} isEditing={true} />
    </div>
  );
} 
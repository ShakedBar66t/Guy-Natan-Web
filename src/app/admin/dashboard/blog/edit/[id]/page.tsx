'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BlogEditor from '@/components/BlogEditor';
import Loader from '@/components/Loader';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  isPublished: boolean;
}

export default function EditBlogPost() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchPost() {
      try {
        const id = params.id;
        const response = await fetch(`/api/admin/blog/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch post');
        }
        
        const data = await response.json();
        setPost(data);
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    }
    
    fetchPost();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader text="טוען מאמר..." />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-700">{error || 'Blog post not found'}</div>
      </div>
    );
  }

  return <BlogEditor post={post} isEditing={true} />;
} 
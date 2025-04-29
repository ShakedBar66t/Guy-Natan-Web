'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Loader from '@/components/Loader';

export default function Dashboard() {
  const [stats, setStats] = useState({
    blogPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
  });
  
  const [ynetStats, setYnetStats] = useState({
    ynetArticles: 0,
    recentArticles: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true);
        
        // Fetch blog stats
        const blogResponse = await fetch('/api/admin/blog/stats');
        
        if (!blogResponse.ok) {
          throw new Error('Failed to fetch blog stats');
        }
        
        const blogData = await blogResponse.json();
        setStats(blogData);
        
        // Fetch Ynet stats
        const ynetResponse = await fetch('/api/admin/ynet/stats');
        
        if (!ynetResponse.ok) {
          throw new Error('Failed to fetch Ynet stats');
        }
        
        const ynetData = await ynetResponse.json();
        setYnetStats(ynetData);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        setError('טעינת סטטיסטיקות נכשלה');
      } finally {
        setLoading(false);
      }
    }
    
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader text="טוען את לוח הבקרה..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <div className="text-sm text-red-700">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-2 md:space-y-6 md:p-0">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        <div className="rounded-lg bg-white p-4 shadow-sm md:p-6">
          <h3 className="text-base font-medium text-gray-700 md:text-lg">סך הכל מאמרים</h3>
          <p className="mt-2 text-2xl font-bold md:text-3xl">{stats.blogPosts}</p>
        </div>
        
        <div className="rounded-lg bg-white p-4 shadow-sm md:p-6">
          <h3 className="text-base font-medium text-gray-700 md:text-lg">מאמרים שפורסמו</h3>
          <p className="mt-2 text-2xl font-bold md:text-3xl">{stats.publishedPosts}</p>
        </div>
        
        <div className="rounded-lg bg-white p-4 shadow-sm md:p-6">
          <h3 className="text-base font-medium text-gray-700 md:text-lg">טיוטות</h3>
          <p className="mt-2 text-2xl font-bold md:text-3xl">{stats.draftPosts}</p>
        </div>
      </div>
      
      {/* Ynet Statistics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        <div className="rounded-lg bg-white p-4 shadow-sm md:p-6">
          <h3 className="text-base font-medium text-gray-700 md:text-lg">סך הכל כתבות Ynet</h3>
          <p className="mt-2 text-2xl font-bold md:text-3xl">{ynetStats.ynetArticles}</p>
        </div>
        
        <div className="rounded-lg bg-white p-4 shadow-sm md:p-6">
          <h3 className="text-base font-medium text-gray-700 md:text-lg">כתבות Ynet מהחודש האחרון</h3>
          <p className="mt-2 text-2xl font-bold md:text-3xl">{ynetStats.recentArticles}</p>
        </div>
      </div>
      
      <div className="rounded-lg bg-white p-4 shadow-sm md:p-6">
        <h3 className="mb-3 text-base font-medium text-gray-700 md:mb-4 md:text-lg">פעולות מהירות</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4 lg:grid-cols-3">
          <Link
            href="/admin/dashboard/blog/new"
            className="flex items-center rounded-md bg-blue-100 p-3 text-sm text-blue-700 hover:bg-blue-200 md:p-4 md:text-base"
          >
            <span className="text-lg">✏️</span>
            <span className="mr-2">צור מאמר חדש</span>
          </Link>
          
          <Link
            href="/admin/dashboard/blog"
            className="flex items-center rounded-md bg-purple-100 p-3 text-sm text-purple-700 hover:bg-purple-200 md:p-4 md:text-base"
          >
            <span className="text-lg">📋</span>
            <span className="mr-2">נהל מאמרים</span>
          </Link>
          
          <Link
            href="/admin/dashboard/ynet/new"
            className="flex items-center rounded-md bg-red-100 p-3 text-sm text-red-700 hover:bg-red-200 md:p-4 md:text-base"
          >
            <span className="text-lg">📰</span>
            <span className="mr-2">הוסף כתבת Ynet חדשה</span>
          </Link>

          <Link
            href="/admin/dashboard/glossary"
            className="flex items-center rounded-md bg-green-100 p-3 text-sm text-green-700 hover:bg-green-200 md:p-4 md:text-base"
            dir="rtl"
          >
            <span className="text-lg">📚</span>
            <span className="mr-2">נהל מילון מונחים</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 
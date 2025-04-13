'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState({
    blogPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/admin/blog/stats');
        
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        
        const data = await response.json();
        setStats(data);
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
      <div className="flex h-full items-center justify-center">
        <div className="text-lg font-medium text-gray-600">טוען את לוח הבקרה...</div>
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-700">סך הכל מאמרים</h3>
          <p className="mt-2 text-3xl font-bold">{stats.blogPosts}</p>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-700">מאמרים שפורסמו</h3>
          <p className="mt-2 text-3xl font-bold">{stats.publishedPosts}</p>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-700">טיוטות</h3>
          <p className="mt-2 text-3xl font-bold">{stats.draftPosts}</p>
        </div>
      </div>
      
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-medium text-gray-700">פעולות מהירות</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/dashboard/blog/new"
            className="flex items-center rounded-md bg-blue-100 p-4 text-blue-700 hover:bg-blue-200"
          >
            <span className="text-lg">✏️</span>
            <span className="mr-2">צור מאמר חדש</span>
          </Link>
          
          <Link
            href="/admin/dashboard/blog"
            className="flex items-center rounded-md bg-purple-100 p-4 text-purple-700 hover:bg-purple-200"
          >
            <span className="text-lg">📋</span>
            <span className="mr-2">נהל מאמרים</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 
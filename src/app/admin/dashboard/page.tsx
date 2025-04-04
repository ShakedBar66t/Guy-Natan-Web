'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Protect this page
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">לוח בקרה</h1>
      
      {session?.user ? (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-medium mb-4">ברוך הבא, {session.user.name}!</h2>
          <p className="text-gray-600 mb-2">מחובר כ: {session.user.email}</p>
          <p className="text-gray-600">סטטוס: {session.user.isAdmin ? 'מנהל' : 'משתמש'}</p>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <p>אינך מחובר.</p>
          <Link href="/admin/login" className="text-blue-500 underline">לחץ כאן להתחברות</Link>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">ניהול מאמרים</h3>
          <p className="text-gray-600 mb-4">צפייה ועריכה של מאמרים באתר</p>
          <Link
            href="/admin/dashboard/blog" 
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            ניהול מאמרים
          </Link>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4">ניהול כתבות YNET</h3>
          <p className="text-gray-600 mb-4">צפייה ועריכה של כתבות YNET</p>
          <Link
            href="/admin/dashboard/ynet" 
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            ניהול כתבות
          </Link>
        </div>
      </div>
    </div>
  );
} 
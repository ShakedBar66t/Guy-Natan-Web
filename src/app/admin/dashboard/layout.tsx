'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include', // Important for cookies
      });
      
      if (response.ok) {
        console.log('Logout successful, refreshing page');
        // Use window.location instead of router for a full page refresh
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  }

  const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`);

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex h-screen bg-gray-100" dir="rtl">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-md">
          <div className="p-6">
            <h1 className="text-xl font-bold">לוח בקרה</h1>
          </div>
          <nav className="space-y-1 px-3 py-4">
            <Link
              href="/admin/dashboard"
              className={`block rounded-md px-3 py-2 ${
                isActive('/admin/dashboard') && 
                !isActive('/admin/dashboard/blog') && 
                !isActive('/admin/dashboard/glossary')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              דף הבית
            </Link>
            <Link
              href="/admin/dashboard/blog"
              className={`block rounded-md px-3 py-2 ${
                isActive('/admin/dashboard/blog')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              מאמרים
            </Link>
            <Link
              href="/admin/dashboard/glossary"
              className={`block rounded-md px-3 py-2 ${
                isActive('/admin/dashboard/glossary')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              מילון מושגים
            </Link>
          </nav>
          <div className="mt-auto p-4">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full rounded-md bg-red-100 px-3 py-2 text-red-700 hover:bg-red-200"
            >
              {isLoggingOut ? 'מתנתק...' : 'התנתק'}
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-auto">
          {/* Header */}
          <header className="bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold">
              {isActive('/admin/dashboard/blog') 
                ? 'ניהול מאמרים' 
                : isActive('/admin/dashboard/glossary')
                  ? 'ניהול מילון מושגים'
                  : 'לוח בקרה'}
            </h2>
          </header>
          
          {/* Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  );
} 
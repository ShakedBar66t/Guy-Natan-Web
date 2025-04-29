'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import logger from '@/utils/logger';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Close sidebar when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include', // Important for cookies
      });
      
      if (response.ok) {
        logger.log('Logout successful, refreshing page');
        // Use window.location instead of router for a full page refresh
        window.location.href = '/';
      }
    } catch (error) {
      logger.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  }

  const isActive = (path: string) => pathname === path || pathname?.startsWith(`${path}/`);
  
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <>
      <Toaster position="top-center" />
      <div className="flex min-h-screen bg-gray-100" dir="rtl">
        {/* Sidebar for desktop - always visible */}
        <div className="hidden lg:block lg:w-64 bg-white border-l">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold">לוח בקרה</h1>
          </div>
          <nav className="space-y-1 p-4">
            <Link
              href="/admin/dashboard"
              className={`block rounded-md px-5 py-2 ${
                isActive('/admin/dashboard') && 
                !isActive('/admin/dashboard/blog') && 
                !isActive('/admin/dashboard/glossary') &&
                !isActive('/admin/dashboard/ynet')
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
            <Link
              href="/admin/dashboard/ynet"
              className={`block rounded-md px-3 py-2 ${
                isActive('/admin/dashboard/ynet')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              כתבות Ynet
            </Link>
          </nav>
          <div className="absolute bottom-0 left-0 right-0 border-t p-4 w-64">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full rounded-md bg-red-100 px-3 py-2 text-red-700 hover:bg-red-200"
            >
              {isLoggingOut ? 'מתנתק...' : 'התנתק'}
            </button>
          </div>
        </div>

        {/* Main content area with mobile header */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-md p-4 flex items-center justify-between relative">
            <button
              className="block lg:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100"
              onClick={toggleSidebar}
              aria-label="פתח תפריט"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold">
              {isActive('/admin/dashboard/blog') 
                ? 'ניהול מאמרים' 
                : isActive('/admin/dashboard/glossary')
                  ? 'ניהול מילון מושגים'
                  : isActive('/admin/dashboard/ynet')
                    ? 'ניהול כתבות Ynet'
                    : 'לוח בקרה'}
            </h2>
            <div className="w-6 lg:hidden"></div> {/* Spacer */}
          </header>

          {/* Mobile dropdown menu */}
          {sidebarOpen && (
            <>
              {/* Backdrop */}
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
                onClick={() => setSidebarOpen(false)}
              ></div>
              
              {/* Dropdown Menu */}
              <div className="top-16 right-0 w-64 bg-white z-50 rounded-b-lg shadow-lg lg:hidden max-h-[80vh]">
                <nav className="space-y-1 p-4">
                  <Link
                    href="/admin/dashboard"
                    className={`block rounded-md px-3 py-2 ${
                      isActive('/admin/dashboard') && 
                      !isActive('/admin/dashboard/blog') && 
                      !isActive('/admin/dashboard/glossary') &&
                      !isActive('/admin/dashboard/ynet')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setSidebarOpen(false)}
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
                    onClick={() => setSidebarOpen(false)}
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
                    onClick={() => setSidebarOpen(false)}
                  >
                    מילון מושגים
                  </Link>
                  <Link
                    href="/admin/dashboard/ynet"
                    className={`block rounded-md px-3 py-2 ${
                      isActive('/admin/dashboard/ynet')
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    כתבות Ynet
                  </Link>
                </nav>
                <div className="border-t p-4">
                  <button
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full rounded-md bg-red-100 px-3 py-2 text-red-700 hover:bg-red-200"
                  >
                    {isLoggingOut ? 'מתנתק...' : 'התנתק'}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Main content */}
          <main className="flex-1 p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  );
} 
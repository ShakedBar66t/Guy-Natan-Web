'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function AdminNavBar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };
  
  return (
    <nav className="bg-indigo-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/admin/dashboard" className="text-xl font-bold">
              מערכת ניהול
            </Link>
          </div>
          
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Link
              href="/admin/dashboard"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/admin/dashboard') ? 'bg-indigo-800' : 'hover:bg-indigo-600'
              }`}
            >
              ראשי
            </Link>
            
            <Link
              href="/admin/dashboard/blog"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/admin/dashboard/blog') ? 'bg-indigo-800' : 'hover:bg-indigo-600'
              }`}
            >
              מאמרים
            </Link>
            
            <Link
              href="/admin/dashboard/ynet"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive('/admin/dashboard/ynet') ? 'bg-indigo-800' : 'hover:bg-indigo-600'
              }`}
            >
              כתבות YNET
            </Link>
            
            <button
              onClick={() => signOut({ callbackUrl: '/admin/login' })}
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-600"
            >
              התנתק
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
} 
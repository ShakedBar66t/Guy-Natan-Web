'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import logger from '@/utils/logger';

export default function AdminButton() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check admin status immediately when component mounts
    checkAdminStatus();
    
    // Also set up an interval to periodically check admin status
    // This helps with navigation between pages without refresh
    const checkInterval = setInterval(() => {
      checkAdminStatus();
    }, 30000); // Check every 30 seconds
    
    return () => {
      clearInterval(checkInterval);
    };
  }, []);

  async function checkAdminStatus() {
    try {
      // Verify admin status by making a request to the server
      // This will use the HttpOnly cookie automatically
      const response = await fetch('/api/admin/verify-auth', {
        credentials: 'include', // Important to include cookies
        cache: 'no-store' // Don't cache this request
      });
      const data = await response.json();
      
      setIsAdmin(data.isAdmin);
    } catch (error) {
      logger.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }

  // Don't show anything if loading or not admin
  if (loading || !isAdmin) {
    return null;
  }

  return (
    <Link
      href="/admin/dashboard"
      className="bg-[#002F42] text-white px-4 py-2 rounded-md hover:bg-[#00435e] transition-colors"
    >
      לוח בקרה
    </Link>
  );
} 
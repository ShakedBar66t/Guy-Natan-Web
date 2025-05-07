'use client';

import { useEffect } from 'react';

// This component adds suppressHydrationWarning to the body element
export default function SuppressHydrationWarnings() {
  useEffect(() => {
    // Add suppressHydrationWarning attribute to the body element
    if (typeof document !== 'undefined') {
      document.body.setAttribute('suppresshydrationwarning', 'true');
    }
    
    // Clean up
    return () => {
      if (typeof document !== 'undefined') {
        document.body.removeAttribute('suppresshydrationwarning');
      }
    };
  }, []);

  return null;
} 
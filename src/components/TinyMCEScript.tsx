'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function TinyMCEScript() {
  const [shouldLoad, setShouldLoad] = useState(false);
  
  // Only load TinyMCE if we're on a page that needs it
  useEffect(() => {
    // Check if we're on an admin page or a page that uses the editor
    const isAdminPage = window.location.pathname.includes('/admin');
    const hasEditorElement = document.querySelector('[data-tinymce]');
    
    if (isAdminPage || hasEditorElement) {
      setShouldLoad(true);
    }
  }, []);

  if (!shouldLoad) {
    return null;
  }

  return (
    <Script
      src="https://cdn.tiny.cloud/1/l9jp7dztnnrgwndr7c2jgmuo1qxht4324yt0p53g0qlfby1w/tinymce/6/tinymce.min.js"
      strategy="lazyOnload"
      onLoad={() => {
        console.log('TinyMCE loaded');
      }}
    />
  );
}
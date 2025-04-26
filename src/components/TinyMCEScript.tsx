'use client';

import Script from 'next/script';

export default function TinyMCEScript() {
  // Use your free API key from TinyMCE Cloud
  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY;
  
  return (
    <Script
      src={`https://cdn.tiny.cloud/1/${apiKey}/tinymce/6/tinymce.min.js`}
      referrerPolicy="origin"
      strategy="beforeInteractive"
    />
  );
}
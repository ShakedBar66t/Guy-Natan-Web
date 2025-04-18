'use client';

import Script from 'next/script';

export default function TinyMCEScript() {
  // Use your free API key from TinyMCE Cloud - even a basic free key will work better than no-api-key
  const apiKey = process.env.NEXT_PUBLIC_TINYMCE_API_KEY || 'jgw7r4whf2iiqa7myirz951f62c1zn9gj77q7i0vfj6pcfyi';
  
  return (
    <Script
      src={`https://cdn.tiny.cloud/1/${apiKey}/tinymce/6/tinymce.min.js`}
      referrerPolicy="origin"
      strategy="beforeInteractive"
    />
  );
} 
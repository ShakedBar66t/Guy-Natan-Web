'use client';

import Script from 'next/script';

export default function TinyMCEScript() {
  // For client-side, use a direct value since env vars might not be loading correctly
  const apiKey = 'l9jp7dztnnrgwndr7c2jgmuo1qxht4324yt0p53g0qlfby1w';
  
  return (
    <Script
      src={`https://cdn.tiny.cloud/1/${apiKey}/tinymce/6/tinymce.min.js`}
      referrerPolicy="origin"
      strategy="beforeInteractive"
    />
  );
}
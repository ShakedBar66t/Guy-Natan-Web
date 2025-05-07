'use client';

import dynamic from 'next/dynamic';

// Dynamic import with ssr: false in a client component
const TinyMCEScript = dynamic(() => import('@/components/TinyMCEScript'), { 
  ssr: false 
});

export default function ClientTinyMCEScript() {
  return <TinyMCEScript />;
} 
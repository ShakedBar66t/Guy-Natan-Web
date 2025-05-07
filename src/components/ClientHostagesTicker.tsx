'use client';

import dynamic from 'next/dynamic';

// Dynamic import with ssr: false in a client component
const HostagesTicker = dynamic(() => import('@/components/HostagesTicker'), { 
  ssr: false 
});

export default function ClientHostagesTicker() {
  return <HostagesTicker />;
} 
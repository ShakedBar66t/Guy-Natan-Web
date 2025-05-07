'use client';

import dynamic from 'next/dynamic';

// Dynamic import with ssr: false in a client component
const WhatsAppButton = dynamic(() => import('@/components/WhatsAppButton'), { 
  ssr: false 
});

export default function ClientWhatsAppButton() {
  return <WhatsAppButton />;
} 
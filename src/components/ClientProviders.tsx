'use client';

import dynamic from 'next/dynamic';
import { ReactNode } from 'react';

// Dynamic import with ssr: false in a client component
const ProvidersComponent = dynamic(() => import('@/app/providers').then(mod => ({ default: mod.Providers })), { 
  ssr: false 
});

export default function ClientProviders({ children }: { children: ReactNode }) {
  return <ProvidersComponent>{children}</ProvidersComponent>;
} 
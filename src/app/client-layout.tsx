'use client';

import { ReactNode, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import SuppressHydrationWarnings from '@/components/SuppressHydrationWarnings';

// Import all components dynamically with SSR disabled
const ClientProviders = dynamic(() => import('@/components/ClientProviders'), { ssr: false });
const ClientWhatsAppButton = dynamic(() => import('@/components/ClientWhatsAppButton'), { ssr: false });
const ClientHostagesTicker = dynamic(() => import('@/components/ClientHostagesTicker'), { ssr: false });
const Header = dynamic(() => import('@/components/Header'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });
const ContactFormSection = dynamic(() => import('@/components/ContactFormSection'), { ssr: false });
const CustomInstagramFeed = dynamic(() => import('@/components/CustomInstagramFeed'), { ssr: false });

export default function ClientLayout({ children }: { children: ReactNode }) {
  // Only render content after mounting on client
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Set mounted state after a short delay to ensure client-side only rendering
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  // Return a very minimal client-only shell during SSR
  if (!isMounted) {
    return <SuppressHydrationWarnings />;
  }

  return (
    <>
      <SuppressHydrationWarnings />
      <ClientProviders>
        <div className="pt-12">
          <Header />
          <main>{children}</main>
          <ContactFormSection />
          <CustomInstagramFeed />
          <Footer />
          <ClientWhatsAppButton />
          <ClientHostagesTicker />
        </div>
      </ClientProviders>
    </>
  );
} 
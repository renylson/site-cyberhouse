'use client';

import { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import StructuredData from '@/components/StructuredData';
import DynamicFavicon from '@/components/DynamicFavicon';
import { useSettings } from '@/hooks/useSettings';

export default function PublicPageWrapper({ children }: { children: ReactNode }) {
  const { settings } = useSettings();

  return (
    <>
      <StructuredData settings={settings} />
      <DynamicFavicon faviconUrl={settings.favicon || undefined} />
      <Navbar />
      {children}
      <Footer />
      <WhatsAppButton />
    </>
  );
}

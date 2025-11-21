'use client';

import { useEffect } from 'react';

interface DynamicFaviconProps {
  faviconUrl?: string;
}

export default function DynamicFavicon({ faviconUrl }: DynamicFaviconProps) {
  useEffect(() => {
    if (!faviconUrl) return;

    const updateFavicon = () => {
      const links = document.querySelectorAll('link[rel*="icon"]');
      links.forEach((link) => {
        (link as HTMLLinkElement).href = faviconUrl;
      });

      if (links.length === 0) {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = faviconUrl;
        document.head.appendChild(newLink);
      }
    };

    updateFavicon();
  }, [faviconUrl]);

  return null;
}

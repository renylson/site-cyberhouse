'use client';

import { useEffect } from 'react';

interface StructuredDataProps {
  settings?: {
    phone?: string;
    address?: string;
    whatsapp?: string;
  };
}

export default function StructuredData({ settings }: StructuredDataProps) {
  useEffect(() => {
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'InternetServiceProvider',
      name: 'Cyberhouse',
      url: 'https://cyberhousenet.com.br',
      logo: 'https://cyberhousenet.com.br/uploads/settings/logo-1761067140101.png',
      description: 'Provedor de internet de alta velocidade com fibra óptica. Wi-Fi incluso, instalação grátis e suporte 24/7.',
      telephone: settings?.phone || '(87) 98169-0984',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Petrolina',
        addressRegion: 'PE',
        addressCountry: 'BR',
        streetAddress: settings?.address || 'Rua 11, nº 50 - Cosme e Damião',
      },
      sameAs: [
        'https://www.facebook.com/cyberhousenet',
        'https://www.instagram.com/cyberhousenet',
      ],
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: settings?.phone || '(87) 98169-0984',
          contactType: 'customer service',
          areaServed: 'BR',
          availableLanguage: 'Portuguese',
        },
      ],
    };

    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Cyberhouse',
      url: 'https://cyberhousenet.com.br',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://cyberhousenet.com.br/planos?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Início',
          item: 'https://cyberhousenet.com.br',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Planos',
          item: 'https://cyberhousenet.com.br/planos',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: 'Suporte',
          item: 'https://cyberhousenet.com.br/suporte',
        },
      ],
    };

    const addSchema = (id: string, schema: object) => {
      let script = document.getElementById(id) as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.id = id;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    };

    addSchema('organization-schema', organizationSchema);
    addSchema('website-schema', websiteSchema);
    addSchema('breadcrumb-schema', breadcrumbSchema);
  }, [settings]);

  return null;
}

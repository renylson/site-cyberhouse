import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'] });

async function getSettings() {
  try {
    const response = await fetch('/api/settings', {
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const faviconUrl = settings?.favicon || '/favicon.ico';

  return {
    title: {
      default: 'Cyberhouse - Internet de Alta Velocidade',
      template: '%s | Cyberhouse'
    },
    description: 'Provedor de internet de alta velocidade com fibra óptica. Wi-Fi incluso, instalação grátis e suporte 24/7. Conecte-se ao futuro com qualidade e estabilidade.',
    keywords: ['internet', 'fibra óptica', 'ISP', 'internet rápida', 'wi-fi', 'banda larga', 'internet residencial', 'internet empresarial', 'provedor de internet'],
    authors: [{ name: 'Cyberhouse' }],
    creator: 'Cyberhouse',
    publisher: 'Cyberhouse',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      type: 'website',
      locale: 'pt_BR',
      url: 'https://cyberhousenet.com.br',
      siteName: 'Cyberhouse',
      title: 'Cyberhouse - Internet de Alta Velocidade',
      description: 'Provedor de internet de alta velocidade com fibra óptica. Wi-Fi incluso, instalação grátis e suporte 24/7.',
      images: [
        {
          url: settings?.logo || '/logo.png',
          width: 1200,
          height: 630,
          alt: 'Cyberhouse - Internet de Alta Velocidade',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Cyberhouse - Internet de Alta Velocidade',
      description: 'Provedor de internet de alta velocidade com fibra óptica. Wi-Fi incluso, instalação grátis e suporte 24/7.',
      images: [settings?.logo || '/logo.png'],
    },
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 5,
    },
    verification: {
      google: 'google-site-verification-code',
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="theme-color" content="#ffffff" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="canonical" href="https://cyberhousenet.com.br" />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/painel/', '/api/'],
      },
    ],
    sitemap: 'https://cyberhousenet.com.br/sitemap.xml',
  };
}

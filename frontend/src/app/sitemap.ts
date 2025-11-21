import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://cyberhousenet.com.br',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://cyberhousenet.com.br/planos',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: 'https://cyberhousenet.com.br/suporte',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://cyberhousenet.com.br/trabalhe-conosco',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://cyberhousenet.com.br/termos',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://cyberhousenet.com.br/privacidade',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
}

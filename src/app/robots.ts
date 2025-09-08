import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const base = 'https://dpo2u.com.br';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/'],
    },
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}


import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/config';

export default function robots(): MetadataRoute.Robots {
  const base = SITE_URL.replace(/\/$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/'],
        disallow: ['/admin', '/dashboard', '/api', '/_next', '/*?*'],
      },
      {
        userAgent: 'GPTBot',
        allow: ['/'],
        disallow: ['/admin', '/dashboard', '/api', '/_next', '/*?*'],
      },
      {
        userAgent: 'CCBot',
        allow: ['/'],
        disallow: ['/admin', '/dashboard', '/api', '/_next', '/*?*'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/'],
        disallow: ['/admin', '/dashboard', '/api', '/_next', '/*?*'],
      },
      {
        userAgent: 'Anthropic-AI',
        allow: ['/'],
        disallow: ['/admin', '/dashboard', '/api', '/_next', '/*?*'],
      },
      {
        userAgent: 'Google-Extended',
        allow: ['/'],
        disallow: ['/admin', '/dashboard', '/api', '/_next', '/*?*'],
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: ['/'],
        disallow: ['/admin', '/dashboard', '/api', '/_next', '/*?*'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
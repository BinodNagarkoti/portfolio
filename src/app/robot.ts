import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/config';
import { getPosts } from '@/lib/actions';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = SITE_URL.replace(/\/$/, '');

  let allowedBlogPaths: string[] = [];

  try {
    const result = await getPosts();

    if (result.error) {
      console.error('[robots] Failed to fetch blog posts:', result.error);
    }

    allowedBlogPaths = (result.data ?? []).map((post) => `/blog/${post.id}`);
  } catch (error) {
    console.error('[robots] Unexpected error fetching blog posts:', error);
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', ...allowedBlogPaths],
        disallow: ['/admin', '/blog/','/*?*'],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
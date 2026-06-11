import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/config';
import { getPosts } from '@/lib/actions';

export const dynamic = 'force-dynamic';

const base = SITE_URL.replace(/\/$/, '');

const homePage: MetadataRoute.Sitemap[number] = {
  url: base,
  lastModified: new Date(),
  changeFrequency: 'daily',
  priority: 1,
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let blogEntries: MetadataRoute.Sitemap = [];

  try {
    const result = await getPosts();

    if (result.error) {
      console.error('[sitemap] Failed to fetch blog posts:', result.error);
    }

    blogEntries = (result.data ?? []).map((post) => ({
      url: `${base}/blog/${post.id}`,
      lastModified: post.published_at ? new Date(post.published_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('[sitemap] Unexpected error fetching blog posts:', error);
  }

  return [homePage, ...blogEntries];
}
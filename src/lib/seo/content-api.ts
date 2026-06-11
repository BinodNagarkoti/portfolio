import { fetchPublicPosts } from '@/lib/supabase/public';
import { filterPublicPaths } from '@/lib/seo/paths';

export interface PublicRouteEntry {
  path: string;
  lastmod: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
}

/**
 * Mock async content API — merges static public routes with live Supabase slugs.
 * Administrative paths are stripped before return.
 */
export async function fetchPublicRoutes(): Promise<PublicRouteEntry[]> {
  const staticRoutes: PublicRouteEntry[] = [
    { path: '/', lastmod: new Date().toISOString(), changeFrequency: 'weekly' },
    { path: '/blog', lastmod: new Date().toISOString(), changeFrequency: 'daily' },
  ];

  const posts = await fetchPublicPosts();
  const blogRoutes: PublicRouteEntry[] =
    posts.map((post) => ({
      path: `/blog/${post.slug}`,
      lastmod: post.updated_at ?? post.created_at,
      changeFrequency: 'weekly' as const,
    })) ?? [];

  const merged = [...staticRoutes, ...blogRoutes];
  const uniqueByPath = new Map<string, PublicRouteEntry>();
  for (const route of merged) {
    uniqueByPath.set(route.path, route);
  }

  const publicPaths = filterPublicPaths([...uniqueByPath.keys()]);
  return publicPaths.map((path) => uniqueByPath.get(path)!);
}

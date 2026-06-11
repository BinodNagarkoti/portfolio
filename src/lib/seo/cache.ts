import { unstable_cache } from 'next/cache';
import { fetchPublicRoutes } from '@/lib/seo/content-api';
import { fetchPublicPersonalInfo, fetchPublicPostBySlug } from '@/lib/supabase/public';

/** Sitemap + route list — revalidates daily. */
export const getCachedPublicRoutes = unstable_cache(
  async () => fetchPublicRoutes(),
  ['seo-public-routes'],
  { revalidate: 86_400, tags: ['sitemap'] },
);

/** Personal info for public layouts — revalidates daily. */
export const getCachedPersonalInfo = unstable_cache(
  async () => fetchPublicPersonalInfo(),
  ['seo-personal-info'],
  { revalidate: 86_400, tags: ['personal-info'] },
);

/** Category content — long-lived cache for crawler-fast responses. */
export function getCachedCategoryContent(category: string, slug: string) {
  return unstable_cache(
    async () => {
      if (category === 'blog') {
        const data = await fetchPublicPostBySlug(slug);
        return { data, error: data ? null : ('not_found' as const) };
      }
      return { data: null, error: 'unsupported_category' as const };
    },
    ['seo-category-content', category, slug],
    { revalidate: 2_592_000, tags: [`post-${slug}`] },
  )();
}

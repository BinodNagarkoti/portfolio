import type { MetadataRoute } from 'next';
import { SITEMAP_PAGE_SIZE, SITE_URL } from '@/lib/seo/config';
import { getCachedPublicRoutes } from '@/lib/seo/cache';
import { calculatePriority } from '@/lib/seo/paths';

export const dynamic = 'force-dynamic'

export async function generateSitemaps() {
  const routes = await getCachedPublicRoutes();
  const pageCount = Math.max(1, Math.ceil(routes.length / SITEMAP_PAGE_SIZE));
  return Array.from({ length: pageCount }, (_, id) => ({ id }));
}

export default async function sitemap({
  id,
}: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  try{

    const resolvedId = Number(await id);
    const routes = await getCachedPublicRoutes();

  const start = resolvedId * SITEMAP_PAGE_SIZE;
  const slice = routes.slice(start, start + SITEMAP_PAGE_SIZE);
  const base = SITE_URL.replace(/\/$/, '');
  
  return slice.map((route) => ({
    url: `${base}${route.path}`,
    lastModified: route.lastmod,
    changeFrequency: route.changeFrequency,
    priority: calculatePriority(route.path),
  }));
}catch(error){
  console.error('Failed to fetch audio data for sitemap:', error);
  return [{
    url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1
    }];
}
}

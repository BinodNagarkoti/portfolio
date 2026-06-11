/** Canonical site origin — required for metadataBase and sitemap URLs. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://binodfolio.com';

/** Route segments that must never be indexed or receive public SEO treatment. */
export const ADMIN_BLOCKED_TERMS = [
  'admin',
  'dashboard',
  'control-panel',
  'login',
  'reset-password',
  'new-password-reset',
] as const;

/** Path prefixes excluded from sitemaps, JSON-LD, and crawler metadata. */
export const ADMIN_PATH_PREFIXES = [
  '/admin',
  '/dashboard',
  '/api',
  '/_next',
] as const;

/** Google sitemap partition size (max URLs per sitemap file). */
export const SITEMAP_PAGE_SIZE = 50_000;

/** Title / description length caps for SERP display. */
export const SEO_TITLE_MAX = 60;
export const SEO_DESCRIPTION_MAX = 155;

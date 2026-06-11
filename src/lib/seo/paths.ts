import {
  ADMIN_BLOCKED_TERMS,
  ADMIN_PATH_PREFIXES,
  SITE_URL,
} from '@/lib/seo/config';

const ADMIN_TERM_PATTERN = new RegExp(
  `^(${ADMIN_BLOCKED_TERMS.join('|')})$`,
  'i',
);

const ADMIN_PATH_PATTERN = new RegExp(
  `(${ADMIN_PATH_PREFIXES.map((p) => p.replace(/\//g, '\\/')).join('|')})`,
  'i',
);

export function isAdminSegment(segment: string): boolean {
  return ADMIN_TERM_PATTERN.test(segment.trim());
}

export function isAdminPath(pathname: string): boolean {
  const normalized = pathname.toLowerCase();
  return ADMIN_PATH_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

export function filterPublicPaths(paths: string[]): string[] {
  return paths.filter((path) => {
    const normalized = path.toLowerCase();
    if (ADMIN_PATH_PATTERN.test(normalized)) return false;
    const segments = normalized.split('/').filter(Boolean);
    return !segments.some((segment) => isAdminSegment(segment));
  });
}

export function resolveCanonicalUrl(pathname: string): string {
  const base = SITE_URL.replace(/\/$/, '');
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const withoutTrailingSlash =
    path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  return `${base}${withoutTrailingSlash}`;
}

/** Deeper paths receive slightly lower priority (homepage = 1.0). */
export function calculatePriority(pathname: string): number {
  const depth = pathname.split('/').filter(Boolean).length;
  if (depth <= 1) return 1.0;
  if (depth === 2) return 0.8;
  if (depth === 3) return 0.6;
  return 0.4;
}

export function truncateForSeo(
  text: string,
  maxLength: number,
  suffix = '…',
): string {
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length <= maxLength) return trimmed;
  return `${trimmed.slice(0, maxLength - suffix.length).trimEnd()}${suffix}`;
}

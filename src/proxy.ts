import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

/** Enforce lowercase paths and strip trailing slashes on public routes. */
const NORMALIZE_TRAILING_SLASH = true;

type LegacyRedirect = {
  from: string;
  to: string;
  permanent?: boolean;
};

const LEGACY_REDIRECTS: LegacyRedirect[] = [
  { from: '/home', to: '/', permanent: true },
  { from: '/posts', to: '/blog', permanent: true },
];

function normalizePublicPathname(pathname: string): string {
  let normalized = pathname.toLowerCase();

  if (NORMALIZE_TRAILING_SLASH && normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
}

function applyLegacyRedirect(
  request: NextRequest,
  pathname: string,
): NextResponse | null {
  const match = LEGACY_REDIRECTS.find((entry) => entry.from === pathname);
  if (!match) return null;

  const url = request.nextUrl.clone();
  url.pathname = match.to;
  return NextResponse.redirect(url, match.permanent !== false ? 301 : 302);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin fast-path: session auth only — skip SEO canonical/redirect hooks.
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
    return updateSession(request);
  }

  const normalizedPath = normalizePublicPathname(pathname);

  if (normalizedPath !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = normalizedPath;
    return NextResponse.redirect(url, 301);
  }

  const redirect = applyLegacyRedirect(request, normalizedPath);
  if (redirect) {
    redirect.headers.set('Vary', 'Accept-Language');
    return redirect;
  }

  const response = NextResponse.next({ request });
  const acceptLanguage = request.headers.get('accept-language');

  if (acceptLanguage) {
    response.headers.set('Vary', 'Accept-Language');
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif)$).*)',
  ],
};

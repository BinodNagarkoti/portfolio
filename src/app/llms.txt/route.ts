import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/lib/seo/config';

export const dynamic = 'force-static';

export async function GET() {
  const content = `# ${SITE_NAME}
${SITE_DESCRIPTION}

Base URL: ${SITE_URL}

## Content Sources
- Blog Posts: ${SITE_URL}/blogs/[slug]
- Sitemap: ${SITE_URL}/sitemap.xml

## Crawling Instructions
- Please respect the robots.txt file.
- Focus on public blog posts and portfolio pages.
- Do not crawl /admin, /dashboard, /api, or any authenticated routes.
- Content is primarily in English.
`;

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

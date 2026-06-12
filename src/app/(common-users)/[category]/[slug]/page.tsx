import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import SectionWrapper from '@/components/common/SectionWrapper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { MarkdownPreview } from '@/components/common/MarkdownPreview';
import { getCachedCategoryContent } from '@/lib/seo/cache';
import {
  SEO_DESCRIPTION_MAX,
  SEO_TITLE_MAX,
  SITE_NAME,
  SITE_URL,
} from '@/lib/seo/config';
import {
  isAdminSegment,
  resolveCanonicalUrl,
  truncateForSeo,
} from '@/lib/seo/paths';

type PageProps = {
  params: Promise<{ category: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const ADMIN_ROBOTS: Metadata['robots'] = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: { index: false, follow: false, noimageindex: true },
};

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  await searchParams;

  if (isAdminSegment(category) || isAdminSegment(slug)) {
    return { robots: ADMIN_ROBOTS };
  }

  const { data: post } = await getCachedCategoryContent(category, slug);

  if (!post) {
    return {
      title: 'Not Found',
      robots: { index: false, follow: false },
    };
  }

  const title = truncateForSeo(`${post.title} | ${category}`, SEO_TITLE_MAX);
  const description = truncateForSeo(
    post.snippet ?? post.content,
    SEO_DESCRIPTION_MAX,
  );
  const canonical = resolveCanonicalUrl(`/${category}/${slug}`);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url: canonical,
      title,
      description,
      siteName: 'Portfolio',
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      tags: post.tags ?? undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function CategorySlugPage({ params }: PageProps) {
  const { category, slug } = await params;

  if (isAdminSegment(category) || isAdminSegment(slug)) {
    notFound();
  }

  const { data: post } = await getCachedCategoryContent(category, slug);

  if (!post) {
    notFound();
  }

  const canonical = resolveCanonicalUrl(`/${category}/${slug}`);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.snippet ?? post.content,
    author: {
      '@type': 'Person',
      name: SITE_NAME,
    },
    datePublished: post.published_at,
    dateModified: post.updated_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonical,
    },
    keywords: post.tags?.join(', '),
  };

  return (
    <SectionWrapper>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto pt-16">
        <Card className="bg-card/50 backdrop-blur-xs">
          <CardHeader className="text-center border-b pb-6">
            <CardTitle className="text-4xl md:text-5xl font-bold font-headline">
              {post.title}
            </CardTitle>
            <CardDescription className="pt-2">
              Posted on {format(parseISO(post.created_at), 'PPP')}
            </CardDescription>
            <div className="flex justify-center flex-wrap gap-2 pt-4">
              {post.tags?.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-8">
            <article className="prose prose-lg dark:prose-invert max-w-none mx-auto">
              <MarkdownPreview source={post.content} />
            </article>
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
}

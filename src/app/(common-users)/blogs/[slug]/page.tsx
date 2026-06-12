
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/actions';
import SectionWrapper from '@/components/common/SectionWrapper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import { MarkdownPreview } from '@/components/common/MarkdownPreview';
import type { Metadata } from 'next';
import { cache } from 'react';
import {
  SEO_DESCRIPTION_MAX,
  SEO_TITLE_MAX,
  SITE_NAME,
  SITE_URL,
} from '@/lib/seo/config';
import { resolveCanonicalUrl, truncateForSeo } from '@/lib/seo/paths';

type Props = {
  params: Promise<{ slug: string }>;
};

const getPostDetails = cache(getPostBySlug);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: post } = await getPostDetails((await params).slug);
  if (!post) {
    return {
      title: 'Post Not Found',
      robots: { index: false, follow: false },
    };
  }

  const title = truncateForSeo(`${post.title} | Blog`, SEO_TITLE_MAX);
  const description = truncateForSeo(post.snippet ?? post.content, SEO_DESCRIPTION_MAX);
  const canonical = resolveCanonicalUrl(`/blogs/${post.slug}`);

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
      siteName: SITE_NAME,
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

export default async function BlogPostPage({ params }: Props) {
  const { data: post } = await getPostDetails((await params).slug);

  if (!post) {
    notFound();
  }

  const canonical = `${SITE_URL}/blogs/${post.slug}`;
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
            <CardTitle className="text-4xl md:text-5xl font-bold font-headline">{post.title}</CardTitle>
            <CardDescription className="pt-2">
              Posted on {format(parseISO(post.created_at), 'PPP')}
            </CardDescription>
            <div className="flex justify-center flex-wrap gap-2 pt-4">
              {post.tags?.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
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

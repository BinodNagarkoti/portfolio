
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/actions';
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
import ThemeShapeGrid from '@/components/reactbits/Backgrounds/ThemeShapeGrid';
import { ArrowLeftIcon, CalendarIcon, ClockIcon } from 'lucide-react';
import Link from 'next/link';

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

const estimateReadTime = (content: string): number => {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

export default async function BlogPostPage({ params }: Props) {
  const { data: post } = await getPostDetails((await params).slug);

  if (!post) {
    notFound();
  }

  const readTime = estimateReadTime(post.content);
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
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <ThemeShapeGrid />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
        >
          <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Blog
        </Link>

        <article className="prose-container">
          <header className="mb-10 pb-8 border-b border-border/50">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags?.map(tag => (
                <Badge key={tag} variant="secondary" className="font-medium">{tag}</Badge>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-headline text-foreground leading-tight mb-4">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4" />
                <time dateTime={post.published_at ?? post.created_at}>
                  {format(parseISO(post.published_at ?? post.created_at), 'MMMM d, yyyy')}
                </time>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <ClockIcon className="w-4 h-4" />
                {readTime} min read
              </span>
            </div>
          </header>

          <div className="article-content">
            <MarkdownPreview source={post.content} />
          </div>

          <footer className="mt-12 pt-8 border-t border-border/50">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              More Articles
            </Link>
          </footer>
        </article>
      </div>
    </div>
  );
}

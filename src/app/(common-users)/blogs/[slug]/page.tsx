
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/actions';
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
import { ArrowLeftIcon } from 'lucide-react';
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
    '@type': 'TechArticle',
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
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-20">
        <header className="mb-10">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span className="font-medium">Back to Blog</span>
          </Link>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-block text-xs font-semibold uppercase tracking-wider text-primary hover:text-primary/80 transition-colors cursor-default"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-headline text-foreground leading-[1.15] mb-6 tracking-tight">
            {post.title}
          </h1>

          {/* Target Position Zero: 40-word core answer block immediately below H1 */}
          {(post.snippet || post.content) && (
            <p className="font-semibold text-lg bg-slate-50 p-4 border-l-4 border-primary mb-6 text-slate-800 dark:bg-slate-900 dark:text-slate-200">
              {post.snippet ?? (post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content)}
            </p>
          )}

          <div className="flex items-center gap-3 text-sm text-muted-foreground pb-6 border-b border-border/40">
            <time
              className="font-medium"
              dateTime={post.published_at ?? post.created_at}
            >
              {format(parseISO(post.published_at ?? post.created_at), 'MMM d, yyyy')}
            </time>
            <span className="text-muted-foreground/40">·</span>
            <span>{readTime} min read</span>
          </div>
        </header>

        <div className="blog-post-content">
          <MarkdownPreview source={post.content} fullHeight />
        </div>

        <footer className="mt-16 pt-8 border-t border-border/40">
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
              <span>More articles</span>
            </Link>

            <p className="text-xs text-muted-foreground">
              {SITE_NAME}
            </p>
          </div>
        </footer>
      </article>
    </div>
  );
}

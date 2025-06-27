
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/lib/actions';
import SectionWrapper from '@/components/common/SectionWrapper';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format, parseISO } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Metadata } from 'next';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { data: post } = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | Blog`,
    description: post.snippet,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { data: post } = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <SectionWrapper>
      <div className="max-w-4xl mx-auto pt-16">
        <Card className="bg-card/50 backdrop-blur-sm">
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
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            </article>
          </CardContent>
        </Card>
      </div>
    </SectionWrapper>
  );
}

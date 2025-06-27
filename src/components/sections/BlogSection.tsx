
import SectionWrapper from '../common/SectionWrapper';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { Button } from '../ui/button';
import { getPosts } from '@/lib/actions';
import { format, parseISO } from 'date-fns';

const BlogSection = async () => {
  const { data: posts, error } = await getPosts({ publishedOnly: true });

  if (error || !posts || posts.length === 0) {
    return null;
  }

  return (
    <SectionWrapper id="blog" title="Latest Blog" subtitle="">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Card key={post.id} className="flex flex-col bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>{format(parseISO(post.created_at), 'PPP')}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground text-sm">{post.snippet}</p>
            </CardContent>
            <CardFooter className="flex-col items-start gap-4">
              <div className="flex flex-wrap gap-2">
                {post.tags?.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
              <Button variant="link" asChild className="p-0 h-auto">
                <Link href={`/blog/${post.slug}`}>Read More</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </SectionWrapper>
  );
};
export default BlogSection;

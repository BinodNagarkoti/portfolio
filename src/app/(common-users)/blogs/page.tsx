'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPosts } from '@/lib/actions';
import { Post } from '@/lib/supabase-types';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarIcon, ArrowRightIcon, FileTextIcon } from 'lucide-react';
import ThemeShapeGrid from '@/components/reactbits/Backgrounds/ThemeShapeGrid';

const BlogListPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const result = await getPosts({ admin: false });
        setPosts(result.data ?? []);
        if (result.error) {
          console.error(result.error);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <ThemeShapeGrid />
      </div>
      <div className="max-w-5xl mx-auto py-16 md:py-24 px-4 sm:px-6 lg:px-8 relative z-10">
        {loading ? (
          <>
            <div className="mb-12 text-center">
              <Skeleton className="h-5 w-32 mx-auto mb-3" />
              <Skeleton className="h-10 w-64 mx-auto mb-4" />
              <Skeleton className="h-5 w-96 mx-auto" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="bg-card/50 backdrop-blur-xs">
                  <CardHeader>
                    <Skeleton className="h-6 w-full mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Skeleton className="h-6 w-16" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
              <FileTextIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">No posts yet</h2>
            <p className="text-muted-foreground mb-6">
              Articles are being written. Check back soon for new content.
            </p>
            <Button asChild variant="outline">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-12 text-center">
        <p className="text-base font-semibold uppercase tracking-wider text-primary mb-2 font-headline">
          Articles & Tutorials
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground font-headline mb-4">
          Blog
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Thoughts on development, design, and technology. A collection of articles, tutorials, and insights.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <Card
            key={post.id}
            className="group relative flex flex-col bg-card/50 backdrop-blur-xs border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 overflow-hidden"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <CardHeader className="relative z-10 pb-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <CalendarIcon className="w-3.5 h-3.5" />
                <time dateTime={post.published_at ?? post.created_at}>
                  {format(parseISO(post.published_at ?? post.created_at), 'MMM d, yyyy')}
                </time>
              </div>
              <CardTitle className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors duration-200 line-clamp-2">
                {post.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="relative z-10 grow">
              {post.snippet && (
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                  {post.snippet}
                </p>
              )}
            </CardContent>

            <CardFooter className="relative z-10 flex flex-col items-start gap-3 pt-3 border-t border-border/50">
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs font-medium">
                      {tag}
                    </Badge>
                  ))}
                  {post.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{post.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="p-0 h-auto text-primary hover:text-primary hover:bg-transparent group/link"
              >
                <Link
                  href={`/blogs/${post.slug}`}
                  className="text-sm font-medium inline-flex items-center gap-1.5"
                >
                  Read more
                  <ArrowRightIcon className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-0.5" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BlogListPage;

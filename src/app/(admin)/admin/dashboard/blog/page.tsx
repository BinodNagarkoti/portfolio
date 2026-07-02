
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2Icon, EditIcon, GlobeIcon, EyeOffIcon } from "lucide-react";
import { getPosts, deletePost } from '@/lib/actions';
import type { Post } from '@/lib/supabase-types';
import { PostForm } from '@/components/admin/PostForm';
import { useToast } from '@/hooks/use-toast';
import { AdminPageSkeleton } from '@/components/admin/AdminPageSkeleton';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const { toast } = useToast();

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    const result = await getPosts({ admin: true });
    if (result.error) {
      toast({ variant: 'destructive', title: 'Error fetching posts', description: result.error });
    } else if (result.data) {
      setPosts(result.data);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingPost(null);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await deletePost(id);
    if (result.error) {
      toast({ variant: 'destructive', title: 'Error deleting post', description: result.error });
    } else {
      toast({ title: 'Post deleted' });
      await fetchPosts();
    }
  };

  const onFormSuccess = async () => {
    setDialogOpen(false);
    await fetchPosts();
  };

  if (isLoading) return <AdminPageSkeleton />;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Manage Blog Posts"
        description="Write, edit, and publish your articles."
        buttonText="Add New Post"
        onAdd={handleAddNew}
      />
      <Card>
        <CardHeader>
          <CardTitle>Your Posts</CardTitle>
          <CardDescription>A list of all your blog posts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                   <TableCell>
                    <Badge variant={post.published_at ? 'default' : 'outline'}>
                        {post.published_at ? (
                            <GlobeIcon className="mr-1 h-3 w-3" />
                        ) : (
                             <EyeOffIcon className="mr-1 h-3 w-3" />
                        )}
                      {post.published_at ? 'Published' : 'Draft'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(parseISO(post.created_at), 'PPP')}
                  </TableCell>
                  <TableCell className="text-right">
                    {post.published_at && (
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/blogs/${post.slug}`} target="_blank" title="View live post">
                          <GlobeIcon className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(post)}><EditIcon className="h-4 w-4" /></Button>
                    <AdminDeleteDialog
                      description="This action will permanently delete this post."
                      onConfirm={() => handleDelete(post.id)}
                      trigger={<Button variant="ghost" size="icon"><Trash2Icon className="h-4 w-4 text-destructive" /></Button>}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {posts.length === 0 && (
             <div className="text-center py-12">
                <h3 className="text-xl font-semibold">No Posts Found</h3>
                <p className="text-muted-foreground mt-2">Click "Add New Post" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit Post' : 'Add New Post'}</DialogTitle>
          </DialogHeader>
          <div className="grow overflow-y-auto pr-6">
            <PostForm post={editingPost} onSuccess={onFormSuccess} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

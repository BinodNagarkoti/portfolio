
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { SaveIcon } from 'lucide-react';
import type { Post } from '@/lib/supabase-types';
import { upsertPost } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CustomSelectDate } from '../common/FormItem/CustomSelectDate';
import { render } from 'react-dom';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string().min(1, 'Content is required'),
  tags: z.string().optional(),
  published_at: z.date().optional(),
});

type PostFormValues = z.infer<typeof formSchema>;

interface PostFormProps {
  post?: Post | null;
  onSuccess?: () => void;
}

export function PostForm({ post, onSuccess }: PostFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const defaultValues: Partial<PostFormValues> = {
    title: post?.title || '',
    content: post?.content || '',
    tags: post?.tags?.join(', ') || '',
    published_at: post?.published_at ? new Date(post.published_at) : undefined,
  };

  const form = useForm<PostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const contentValue = form.watch('content');

  const onSubmit = async (values: PostFormValues) => {
    setIsSaving(true);
    
    const dataToSave = {
        id: post?.id,
        ...values,
    };

    const result = await upsertPost(dataToSave);

    if (result.error) {
      toast({ variant: 'destructive', title: 'Error saving post', description: result.error });
    } else {
      toast({ title: 'Post saved successfully' });
      onSuccess?.();
    }
    setIsSaving(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl><Input placeholder="Your amazing post title" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <Tabs defaultValue="write" className="w-full">
                <TabsList className='mb-2'>
                  <TabsTrigger value="write">Write</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>
                <TabsContent value="write">
                  <FormControl>
                    <Textarea
                      placeholder="Write your post content here. Supports Markdown."
                      {...field}
                      rows={15}
                    />
                  </FormControl>
                </TabsContent>
                <TabsContent value="preview">
                  <div className="prose dark:prose-invert prose-sm min-h-[320px] w-full max-w-none rounded-md border p-4 bg-background">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {contentValue || 'Nothing to preview yet.'}
                    </ReactMarkdown>
                  </div>
                </TabsContent>
              </Tabs>
              <FormDescription>Dont know how to use markdown? Check out <a href="https://www.markdownguide.org/">Markdown Guide</a>.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl><Input placeholder="Tech, JavaScript, AI" {...field} value={field.value ?? ''}/></FormControl>
              <FormDescription>Comma-separated list of tags.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="published_at"
          render={({ field }) => (
            <CustomSelectDate disabledPast={false} disabledFuture={true} field={field} label="Published Date" />
            // <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            //   <FormControl>
            //     <Checkbox
            //       checked={field.value}
            //       onCheckedChange={field.onChange}
            //     />
            //   </FormControl>
            //   <div className="space-y-1 leading-none">
            //     <FormLabel>
            //       Publish Post
            //     </FormLabel>
            //     <FormDescription>
            //       Make this post visible on your public portfolio.
            //     </FormDescription>
            //   </div>
            // </FormItem>
          )}
        />

        <Button type="submit" disabled={isSaving}>
            {isSaving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div> : <SaveIcon className="mr-2 h-4 w-4" />}
            {isSaving ? 'Saving...' : 'Save Post'}
        </Button>
      </form>
    </Form>
  );
}

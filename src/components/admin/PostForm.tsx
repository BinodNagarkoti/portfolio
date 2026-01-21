
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { ImageIcon, SaveIcon } from 'lucide-react';
import type { Post } from '@/lib/supabase-types';
import { upsertPost, uploadPostImage } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { type ChangeEvent, useRef, useState } from 'react';
import remarkGfm from 'remark-gfm';
// import remarkFootnotes from 'remark-footnotes';
import remarkDeflist from 'remark-deflist';
import remarkHeadingId from 'remark-heading-id';
import remarkSupersub from 'remark-supersub';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { CustomSelectDate } from '../common/FormItem/CustomSelectDate';
import MDEditor from '@uiw/react-md-editor';
import { type TextAreaTextApi, type TextState } from '@uiw/react-md-editor';

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
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const editorApiRef = useRef<TextAreaTextApi | null>(null);

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

  const handleImageCommand = (_state: TextState, api: TextAreaTextApi) => {
    if (isUploadingImage) {
      return;
    }
    editorApiRef.current = api;
    fileInputRef.current?.click();
  };

  const handleImageFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const result = await uploadPostImage(formData);

      if (result.error || !result.data) {
        toast({ variant: 'destructive', title: 'Image upload failed', description: result.error || 'Unable to upload image.' });
        return;
      }

      const imageMarkdown = `![${file.name}](${result.data.publicUrl})`;
      if (editorApiRef.current) {
        const nextState = editorApiRef.current.replaceSelection(imageMarkdown);
        form.setValue('content', nextState.text, { shouldDirty: true });
      } else {
        const currentContent = form.getValues('content') ?? '';
        form.setValue('content', `${currentContent}\n\n${imageMarkdown}\n`, { shouldDirty: true });
      }
    } finally {
      setIsUploadingImage(false);
      event.target.value = '';
    }
  };

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
              <FormControl>
                <div className="rounded-md border">
                  <MDEditor
                    value={field.value ?? ''}
                    onChange={(value) => field.onChange(value ?? '')}
                    preview="live"
                    height={360}
                    textareaProps={{
                      placeholder: 'Write your post content here. Supports Markdown.',
                      disabled: isUploadingImage,
                    }}
                    commandsFilter={(command) => {
                      if (command.name === 'image') {
                        return {
                          ...command,
                          icon: <ImageIcon size={14} />,
                          execute: handleImageCommand,
                        };
                      }
                      return command;
                    }}
                    previewOptions={{
                      remarkPlugins: [
                        remarkGfm,
                        // remarkFootnotes,
                        remarkDeflist,
                        remarkHeadingId,
                        remarkSupersub,
                      ],
                      rehypePlugins: [
                        rehypeSlug,
                        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
                        rehypeHighlight,
                      ],
                    }}
                  />
                </div>
              </FormControl>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageFileChange}
              />
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

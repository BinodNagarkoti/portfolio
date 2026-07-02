'use client';

import { z } from 'zod';
import type { Post } from '@/lib/supabase-types';
import { upsertPost, uploadPostImage } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { type ChangeEvent, useRef, useState } from 'react';
import remarkGfm from 'remark-gfm';
import remarkDeflist from 'remark-deflist';
import remarkHeadingId from 'remark-heading-id';
import remarkSupersub from 'remark-supersub';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { CustomSelectDate } from '../common/FormItem/CustomSelectDate';
import MDEditor from '@uiw/react-md-editor';
import { type TextAreaTextApi, type TextState } from '@uiw/react-md-editor';
import { ImageIcon } from 'lucide-react';
import { FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DynamicForm, FormSection } from './DynamicForm';

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

  const handleImageCommand = (_state: TextState, api: TextAreaTextApi) => {
    if (isUploadingImage) return;
    editorApiRef.current = api;
    fileInputRef.current?.click();
  };

  const handleImageFileChange = async (event: ChangeEvent<HTMLInputElement>, setContent: (v: string) => void, getContent: () => string) => {
    const file = event.target.files?.[0];
    if (!file) return;
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
        setContent(nextState.text);
      } else {
        setContent(`${getContent()}\n\n${imageMarkdown}\n`);
      }
    } finally {
      setIsUploadingImage(false);
      event.target.value = '';
    }
  };

  const onSubmit = async (values: PostFormValues) => {
    setIsSaving(true);
    const result = await upsertPost({ id: post?.id, ...values });
    if (result.error) {
      toast({ variant: 'destructive', title: 'Error saving post', description: result.error });
    } else {
      toast({ title: 'Post saved successfully' });
      onSuccess?.();
    }
    setIsSaving(false);
  };

  const formSections: FormSection<PostFormValues>[] = [
    {
      rows: [
        {
          fields: [
            { name: 'title', label: 'Title', placeholder: 'Your amazing post title', type: 'text' },
          ],
        },
        {
          fields: [
            {
              name: 'content',
              type: 'custom',
              render: ({ field, form }) => (
                <FormItem>
                  <FormLabel>Content</FormLabel>
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
                        remarkPlugins: [remarkGfm, remarkDeflist, remarkHeadingId, remarkSupersub],
                        rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }], rehypeHighlight],
                      }}
                    />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleImageFileChange(
                        e,
                        (v) => form.setValue('content', v, { shouldDirty: true }),
                        () => form.getValues('content') ?? ''
                      )
                    }
                  />
                  <FormDescription>
                    Don't know how to use markdown? Check out{' '}
                    <a href="https://www.markdownguide.org/" className="text-primary underline">Markdown Guide</a>.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              ),
            },
          ],
        },
        {
          fields: [
            {
              name: 'tags',
              label: 'Tags',
              placeholder: 'Tech, JavaScript, AI',
              type: 'text',
              description: 'Comma-separated list of tags.',
            },
            {
              name: 'published_at',
              type: 'custom',
              render: ({ field }) => (
                <CustomSelectDate field={field} label="Published Date" disabledPast={false} disabledFuture={true} />
              ),
            },
          ],
        },
      ],
    },
  ];

  return (
    <DynamicForm
      schema={formSchema}
      defaultValues={defaultValues}
      sections={formSections}
      onSubmit={onSubmit}
      submitButtonText="Save Post"
      isSaving={isSaving}
    />
  );
}

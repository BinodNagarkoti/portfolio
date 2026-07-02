'use client';

import { z } from 'zod';
import type { Project } from '@/lib/supabase-types';
import { upsertProject } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { FormDescription, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DynamicForm, FormSection } from './DynamicForm';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  long_description: z.string().optional(),
  technologies: z.string().optional(),
  cover_image_url: z.string().optional(),
  live_link: z.string().url().optional().or(z.literal('')),
  github_link: z.string().url().optional().or(z.literal('')),
  project_type: z.enum(['personal', 'professional_freelance', 'professional_employment']),
  category_tags: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof formSchema>;

interface ProjectFormProps {
  project?: Project | null;
  onSuccess?: () => void;
}

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(project?.cover_image_url || null);

  const defaultValues: Partial<ProjectFormValues> = {
    title: project?.title || '',
    description: project?.description || '',
    long_description: project?.long_description || '',
    technologies: project?.technologies?.join(', ') || '',
    cover_image_url: project?.cover_image_url || '',
    live_link: project?.live_link || '',
    github_link: project?.github_link || '',
    project_type: project?.project_type || 'personal',
    category_tags: project?.category_tags?.join(', ') || '',
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: ProjectFormValues) => {
    setIsSaving(true);

    const formData = new FormData();
    if (project?.id) formData.append('id', project.id);
    if (imageFile) formData.append('cover_image', imageFile);

    Object.entries(values).forEach(([key, value]) => {
      if (key === 'cover_image_url') return;
      if (value !== undefined && value !== null) formData.append(key, value as string);
    });

    const result = await upsertProject(formData);

    if (result.error) {
      toast({ variant: 'destructive', title: 'Error saving project', description: result.error });
    } else {
      toast({ title: 'Project saved successfully' });
      onSuccess?.();
    }
    setIsSaving(false);
  };

  const formSections: FormSection<ProjectFormValues>[] = [
    {
      title: 'Basic Info',
      rows: [
        {
          fields: [
            { name: 'title', label: 'Title', placeholder: 'Project Title', type: 'text' },
            {
              name: 'project_type',
              label: 'Project Type',
              type: 'select',
              placeholder: 'Select a project type',
              options: [
                { label: 'Personal', value: 'personal' },
                { label: 'Freelance', value: 'professional_freelance' },
                { label: 'Employment', value: 'professional_employment' },
              ],
            },
          ],
        },
        {
          fields: [
            { name: 'description', label: 'Short Description', placeholder: 'A brief summary of the project.', type: 'textarea' },
          ],
        },
        {
          fields: [
            { name: 'long_description', label: 'Long Description (Optional)', placeholder: 'A more detailed explanation of the project.', type: 'textarea' },
          ],
        },
      ],
    },
    {
      title: 'Media & Links',
      rows: [
        {
          fields: [
            {
              name: 'cover_image_url',
              type: 'custom',
              render: () => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="Image preview" className="w-full h-auto max-h-48 object-contain rounded-md border" />
                    </div>
                  )}
                  <Input type="file" accept="image/*" onChange={handleImageChange} className="mt-2" />
                  <FormDescription>Upload a new image to replace the existing one.</FormDescription>
                </FormItem>
              ),
            },
          ],
        },
        {
          fields: [
            { name: 'live_link', label: 'Live Link', placeholder: 'https://example.com', type: 'text' },
            { name: 'github_link', label: 'GitHub Link', placeholder: 'https://github.com/...', type: 'text' },
          ],
        },
      ],
    },
    {
      title: 'Tags & Technologies',
      rows: [
        {
          fields: [
            {
              name: 'technologies',
              label: 'Technologies',
              placeholder: 'React, Next.js, Supabase',
              type: 'text',
              description: 'Comma-separated list.',
            },
            {
              name: 'category_tags',
              label: 'Category Tags',
              placeholder: 'FinTech, E-commerce',
              type: 'text',
              description: 'Comma-separated list.',
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
      submitButtonText="Save Project"
      isSaving={isSaving}
    />
  );
}

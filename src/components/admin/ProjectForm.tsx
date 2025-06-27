'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Project } from '@/lib/supabase-types';
import { upsertProject } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { SaveIcon, UploadCloudIcon } from 'lucide-react';

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

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: ProjectFormValues) => {
    setIsSaving(true);
    
    const formData = new FormData();
    if (project?.id) {
        formData.append('id', project.id);
    }
    if (imageFile) {
        formData.append('cover_image', imageFile);
    }
    // Append all other form values
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
          formData.append(key, value as string);
      }
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl><Input placeholder="Project Title" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl><Textarea placeholder="A brief summary of the project." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="long_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Long Description (Optional)</FormLabel>
              <FormControl><Textarea placeholder="A more detailed explanation of the project." {...field} rows={5} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="project_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a project type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="professional_freelance">Freelance</SelectItem>
                    <SelectItem value="professional_employment">Employment</SelectItem>
                  </SelectContent>
                </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Cover Image</FormLabel>
          {imagePreview && (
            <div className="mt-2">
                <img src={imagePreview} alt="Image preview" className="w-full h-auto max-h-48 object-contain rounded-md border" />
            </div>
          )}
          <FormControl>
            <Input type="file" accept="image/*" onChange={handleImageChange} className="mt-2" />
          </FormControl>
          <FormDescription>
            Upload a new image to replace the existing one.
          </FormDescription>
        </FormItem>

        <FormField
          control={form.control}
          name="technologies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technologies</FormLabel>
              <FormControl><Input placeholder="React, Next.js, Supabase" {...field} /></FormControl>
              <FormDescription>Comma-separated list.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category_tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Tags</FormLabel>
              <FormControl><Input placeholder="FinTech, E-commerce" {...field} /></FormControl>
              <FormDescription>Comma-separated list.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
            control={form.control}
            name="live_link"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Live Link</FormLabel>
                <FormControl><Input type="url" placeholder="https://example.com" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="github_link"
            render={({ field }) => (
                <FormItem>
                <FormLabel>GitHub Link</FormLabel>
                <FormControl><Input type="url" placeholder="https://github.com/..." {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>

        <Button type="submit" disabled={isSaving}>
            {isSaving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div> : <SaveIcon className="mr-2 h-4 w-4" />}
            {isSaving ? 'Saving...' : 'Save Project'}
        </Button>
      </form>
    </Form>
  );
}

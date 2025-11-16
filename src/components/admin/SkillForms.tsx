
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Skill, SkillCategory } from '@/lib/supabase-types';
import { upsertSkill, upsertSkillCategory } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { SaveIcon } from 'lucide-react';

const categoryFormSchema = z.object({
  name: z.string().min(1, 'Category name is required'),
});
type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface SkillCategoryFormProps {
  category?: SkillCategory | null;
  onSuccess?: () => void;
}

export function SkillCategoryForm({ category, onSuccess }: SkillCategoryFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: { name: category?.name || '' },
  });

  const onSubmit = async (values: CategoryFormValues) => {
    setIsSaving(true);
    const result = await upsertSkillCategory({ id: category?.id, ...values });
    if (result.error) {
      toast({ variant: 'destructive', title: 'Error saving category', description: result.error });
    } else {
      toast({ title: 'Category saved successfully' });
      onSuccess?.();
    }
    setIsSaving(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl><Input placeholder="e.g., Frontend Development" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div> : <SaveIcon className="mr-2 h-4 w-4" />}
          {isSaving ? 'Saving...' : 'Save Category'}
        </Button>
      </form>
    </Form>
  );
}


const skillFormSchema = z.object({
    name: z.string().min(1, 'Skill name is required'),
    level: z.enum(['', 'Basic', 'Intermediate', 'Expert']).optional(),
  });
type SkillFormValues = z.infer<typeof skillFormSchema>;

interface SkillFormProps {
    skill: Skill;
    categoryId: string;
    onSuccess?: () => void;
}

export function SkillForm({ skill, categoryId, onSuccess }: SkillFormProps) {
    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const form = useForm<SkillFormValues>({
        resolver: zodResolver(skillFormSchema),
        defaultValues: {
            name: skill?.name || '',
            level: skill?.level as any || '',
        },
    });

    const onSubmit = async (values: SkillFormValues) => {
        setIsSaving(true);
        const dataToUpsert = {
            id: skill?.id,
            skill_category_id: categoryId,
            name: values.name,
            level: values.level || null,
        };
        const result = await upsertSkill(dataToUpsert);
        if (result.error) {
            toast({ variant: 'destructive', title: 'Error saving skill', description: result.error });
        } else {
            toast({ title: 'Skill saved successfully' });
            onSuccess?.();
        }
        setIsSaving(false);
    };

    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Skill Name</FormLabel>
                <FormControl><Input placeholder="e.g., ReactJS" {...field} /></FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Proficiency Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a proficiency level" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="Basic">Basic</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit" disabled={isSaving}>
                {isSaving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div> : <SaveIcon className="mr-2 h-4 w-4" />}
                {isSaving ? 'Saving...' : 'Save Skill'}
            </Button>
        </form>
        </Form>
    );
}


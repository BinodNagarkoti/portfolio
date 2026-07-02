'use client';

import { z } from 'zod';
import type { Skill, SkillCategory } from '@/lib/supabase-types';
import { upsertSkill, upsertSkillCategory } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { DynamicForm, FormSection } from './DynamicForm';

// ─── Skill Category Form ───────────────────────────────────────────────────

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

  const formSections: FormSection<CategoryFormValues>[] = [
    {
      rows: [
        {
          fields: [
            { name: 'name', label: 'Category Name', placeholder: 'e.g., Frontend Development', type: 'text' },
          ],
        },
      ],
    },
  ];

  return (
    <DynamicForm
      schema={categoryFormSchema}
      defaultValues={{ name: category?.name || '' }}
      sections={formSections}
      onSubmit={onSubmit}
      submitButtonText="Save Category"
      isSaving={isSaving}
    />
  );
}

// ─── Skill Form ────────────────────────────────────────────────────────────

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

  const formSections: FormSection<SkillFormValues>[] = [
    {
      rows: [
        {
          fields: [
            { name: 'name', label: 'Skill Name', placeholder: 'e.g., ReactJS', type: 'text' },
            {
              name: 'level',
              label: 'Proficiency Level',
              type: 'select',
              placeholder: 'Select a proficiency level',
              options: [
                { label: 'Basic', value: 'Basic' },
                { label: 'Intermediate', value: 'Intermediate' },
                { label: 'Expert', value: 'Expert' },
              ],
            },
          ],
        },
      ],
    },
  ];

  return (
    <DynamicForm
      schema={skillFormSchema}
      defaultValues={{ name: skill?.name || '', level: (skill?.level as any) || '' }}
      sections={formSections}
      onSubmit={onSubmit}
      submitButtonText="Save Skill"
      isSaving={isSaving}
    />
  );
}

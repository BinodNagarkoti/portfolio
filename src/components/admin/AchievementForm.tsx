'use client';

import { z } from 'zod';
import type { Achievement } from '@/lib/supabase-types';
import { upsertAchievement } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { DynamicForm, FormSection } from './DynamicForm';
import { CustomSelectDate } from '../common/FormItem/CustomSelectDate';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  date_achieved: z.date().nullable().optional(),
});

type AchievementFormValues = z.infer<typeof formSchema>;

interface AchievementFormProps {
  achievement?: Achievement | null;
  onSuccess?: () => void;
}

export function AchievementForm({ achievement, onSuccess }: AchievementFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const defaultValues: Partial<AchievementFormValues> = {
    title: achievement?.title || '',
    description: achievement?.description || '',
    date_achieved: achievement?.date_achieved ? new Date(achievement.date_achieved) : null,
  };

  const onSubmit = async (values: AchievementFormValues) => {
    setIsSaving(true);
    
    const dataToSave = {
        id: achievement?.id,
        ...values,
        date_achieved: values.date_achieved ? values.date_achieved.toISOString().substring(0, 10) : null,
    };

    const result = await upsertAchievement(dataToSave as any);

    if (result.error) {
      toast({ variant: 'destructive', title: 'Error saving achievement', description: result.error });
    } else {
      toast({ title: 'Achievement saved successfully' });
      onSuccess?.();
    }
    setIsSaving(false);
  };

  const formSections: FormSection<AchievementFormValues>[] = [
    {
      rows: [
        {
          fields: [
            {
              name: 'title',
              label: 'Title',
              placeholder: 'e.g., Hackathon Winner',
              type: 'text',
            },
          ],
        },
        {
          fields: [
            {
              name: 'description',
              label: 'Description (Optional)',
              placeholder: 'Describe the achievement.',
              type: 'textarea',
            },
          ],
        },
        {
          fields: [
            {
              name: 'date_achieved',
              label: 'Date Achieved (Optional)',
              type: 'custom',
              render: ({ field }) => (
                <CustomSelectDate
                  field={field}
                  label=""
                  disabledPast={false}
                  disabledFuture={true}
                />
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
      submitButtonText="Save Achievement"
      isSaving={isSaving}
    />
  );
}

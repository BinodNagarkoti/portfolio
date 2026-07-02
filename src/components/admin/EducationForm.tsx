'use client';

import { z } from 'zod';
import type { Education } from '@/lib/supabase-types';
import { upsertEducation } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { parseISO } from 'date-fns';
import { DynamicForm, FormSection } from './DynamicForm';
import { CustomSelectDate } from '../common/FormItem/CustomSelectDate';

const formSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  institution: z.string().min(1, 'Institution is required'),
  location: z.string().optional(),
  description: z.string().optional(),
  start_date: z.date({ required_error: 'A start date is required.' }),
  end_date: z.date().nullable().optional(),
});

type EducationFormValues = z.infer<typeof formSchema>;

interface EducationFormProps {
  education?: Education | null;
  onSuccess?: () => void;
}

export function EducationForm({ education, onSuccess }: EducationFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const parseDate = (dateStr: string | null | undefined): Date | undefined =>
    dateStr ? parseISO(dateStr) : undefined;

  const defaultValues: Partial<EducationFormValues> = {
    degree: education?.degree || '',
    institution: education?.institution || '',
    location: education?.location || '',
    description: education?.description || '',
    start_date: parseDate(education?.start_date),
    end_date: parseDate(education?.end_date),
  };

  const onSubmit = async (values: EducationFormValues) => {
    setIsSaving(true);

    const dataToSave = {
      id: education?.id,
      ...values,
      start_date: values.start_date.toISOString().substring(0, 10),
      end_date: values.end_date ? values.end_date.toISOString().substring(0, 10) : null,
    };

    const result = await upsertEducation(dataToSave as any);

    if (result.error) {
      toast({ variant: 'destructive', title: 'Error saving education', description: result.error });
    } else {
      toast({ title: 'Education saved successfully' });
      onSuccess?.();
    }
    setIsSaving(false);
  };

  const formSections: FormSection<EducationFormValues>[] = [
    {
      rows: [
        {
          fields: [
            { name: 'degree', label: 'Degree', placeholder: 'e.g., B.Sc. in Computer Science', type: 'text' },
            { name: 'institution', label: 'Institution', placeholder: 'e.g., University of Example', type: 'text' },
          ],
        },
        {
          fields: [
            { name: 'location', label: 'Location (Optional)', placeholder: 'e.g., City, Country', type: 'text' },
          ],
        },
        {
          fields: [
            { name: 'description', label: 'Description (Optional)', placeholder: 'Describe your studies, thesis, or achievements.', type: 'textarea' },
          ],
        },
        {
          fields: [
            {
              name: 'start_date',
              type: 'custom',
              render: ({ field }) => (
                <CustomSelectDate field={field} label="Start Date" disabledPast={false} disabledFuture={true} />
              ),
            },
            {
              name: 'end_date',
              type: 'custom',
              render: ({ field }) => (
                <CustomSelectDate
                  field={field}
                  label="End Date"
                  formDescription="Leave blank if study is ongoing."
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
      submitButtonText="Save Education"
      isSaving={isSaving}
    />
  );
}

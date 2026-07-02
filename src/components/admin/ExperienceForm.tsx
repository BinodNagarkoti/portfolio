'use client';

import { z } from 'zod';
import type { Experience } from '@/lib/supabase-types';
import { upsertExperience } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { parseISO } from 'date-fns';
import { DynamicForm, FormSection } from './DynamicForm';
import { CustomSelectDate } from '../common/FormItem/CustomSelectDate';

const formSchema = z.object({
  job_title: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().optional(),
  description: z.string().optional(),
  start_date: z.date({ required_error: 'A start date is required.' }),
  end_date: z.date().nullable().optional(),
});

type ExperienceFormValues = z.infer<typeof formSchema>;

interface ExperienceFormProps {
  experience?: Experience | null;
  onSuccess?: () => void;
}

export function ExperienceForm({ experience, onSuccess }: ExperienceFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const parseDate = (dateStr: string | null | undefined): Date | undefined =>
    dateStr ? parseISO(dateStr) : undefined;

  const defaultValues: Partial<ExperienceFormValues> = {
    job_title: experience?.job_title || '',
    company: experience?.company || '',
    location: experience?.location || '',
    description: experience?.description || '',
    start_date: parseDate(experience?.start_date),
    end_date: parseDate(experience?.end_date),
  };

  const onSubmit = async (values: ExperienceFormValues) => {
    setIsSaving(true);

    const dataToSave = {
      id: experience?.id,
      ...values,
      start_date: values.start_date.toISOString().substring(0, 10),
      end_date: values.end_date ? values.end_date.toISOString().substring(0, 10) : null,
    };

    const result = await upsertExperience(dataToSave as any);

    if (result.error) {
      toast({ variant: 'destructive', title: 'Error saving experience', description: result.error });
    } else {
      toast({ title: 'Experience saved successfully' });
      onSuccess?.();
    }
    setIsSaving(false);
  };

  const formSections: FormSection<ExperienceFormValues>[] = [
    {
      rows: [
        {
          fields: [
            { name: 'job_title', label: 'Job Title', placeholder: 'e.g., Senior Software Engineer', type: 'text' },
            { name: 'company', label: 'Company', placeholder: 'e.g., Google', type: 'text' },
          ],
        },
        {
          fields: [
            { name: 'location', label: 'Location (Optional)', placeholder: 'e.g., Remote or London, UK', type: 'text' },
          ],
        },
        {
          fields: [
            { name: 'description', label: 'Description (Optional)', placeholder: 'Describe your role and accomplishments.', type: 'textarea' },
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
                  formDescription="Leave blank if this is your current role."
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
      submitButtonText="Save Experience"
      isSaving={isSaving}
    />
  );
}

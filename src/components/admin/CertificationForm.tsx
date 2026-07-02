'use client';

import { z } from 'zod';
import type { Certification } from '@/lib/supabase-types';
import { upsertCertification } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { parseISO } from 'date-fns';
import { DynamicForm, FormSection } from './DynamicForm';
import { CustomSelectDate } from '../common/FormItem/CustomSelectDate';
import { FormDescription, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  issuing_organization: z.string().min(1, 'Issuing organization is required'),
  issue_date: z.date().nullable().optional(),
  credential_id: z.string().optional(),
  credential_url: z.string().url().optional().or(z.literal('')),
  certificate_pdf_url: z.string().optional(),
});

type CertificationFormValues = z.infer<typeof formSchema>;

interface CertificationFormProps {
  certification?: Certification | null;
  onSuccess?: () => void;
}

export function CertificationForm({ certification, onSuccess }: CertificationFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  const parseDate = (dateStr: string | null | undefined): Date | undefined =>
    dateStr ? parseISO(dateStr) : undefined;

  const defaultValues: Partial<CertificationFormValues> = {
    name: certification?.name || '',
    issuing_organization: certification?.issuing_organization || '',
    issue_date: parseDate(certification?.issue_date),
    credential_id: certification?.credential_id || '',
    credential_url: certification?.credential_url || '',
    certificate_pdf_url: certification?.certificate_pdf_url || '',
  };

  const onSubmit = async (values: CertificationFormValues) => {
    setIsSaving(true);

    const formData = new FormData();
    if (certification?.id) formData.append('id', certification.id);
    if (pdfFile) formData.append('certificate_pdf', pdfFile);

    Object.entries(values).forEach(([key, value]) => {
      if (key === 'issue_date' && value instanceof Date) {
        formData.append(key, value.toISOString().substring(0, 10));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value as string);
      }
    });

    const result = await upsertCertification(formData);

    if (result.error) {
      toast({ variant: 'destructive', title: 'Error saving certification', description: result.error });
    } else {
      toast({ title: 'Certification saved successfully' });
      onSuccess?.();
    }
    setIsSaving(false);
  };

  const formSections: FormSection<CertificationFormValues>[] = [
    {
      rows: [
        {
          fields: [
            { name: 'name', label: 'Certification Name', placeholder: 'e.g., Certified Kubernetes Administrator', type: 'text' },
            { name: 'issuing_organization', label: 'Issuing Organization', placeholder: 'e.g., The Linux Foundation', type: 'text' },
          ],
        },
        {
          fields: [
            {
              name: 'issue_date',
              type: 'custom',
              render: ({ field }) => (
                <CustomSelectDate field={field} label="Issue Date" disabledPast={false} disabledFuture={true} />
              ),
            },
            { name: 'credential_id', label: 'Credential ID (Optional)', placeholder: 'e.g., LF-123456', type: 'text' },
          ],
        },
        {
          fields: [
            { name: 'credential_url', label: 'Credential URL (Optional)', placeholder: 'https://verify.credly.com/...', type: 'text' },
          ],
        },
        {
          fields: [
            {
              name: 'certificate_pdf_url',
              type: 'custom',
              render: () => (
                <div className="flex flex-col gap-2">
                  <FormLabel>Certificate PDF (Optional)</FormLabel>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPdfFile(file);
                        toast({ title: 'PDF Selected', description: file.name });
                      }
                    }}
                  />
                  <FormDescription>
                    {certification?.certificate_pdf_url ? (
                      <a href={certification.certificate_pdf_url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                        View current PDF
                      </a>
                    ) : (
                      'Upload a new PDF.'
                    )}
                  </FormDescription>
                </div>
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
      submitButtonText="Save Certification"
      isSaving={isSaving}
    />
  );
}

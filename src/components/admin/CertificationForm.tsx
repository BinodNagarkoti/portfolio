
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, SaveIcon, UploadCloudIcon } from 'lucide-react';
import type { Certification } from '@/lib/supabase-types';
import { upsertCertification } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  issuing_organization: z.string().min(1, 'Issuing organization is required'),
  issue_date: z.date().nullable().optional(),
  credential_id: z.string().optional(),
  credential_url: z.string().url().optional().or(z.literal('')),
  certificate_pdf_url: z.string().optional(), // Used to hold existing URL
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

  const parseDate = (dateStr: string | null | undefined): Date | undefined => {
    return dateStr ? parseISO(dateStr) : undefined;
  };

  const defaultValues: Partial<CertificationFormValues> = {
    name: certification?.name || '',
    issuing_organization: certification?.issuing_organization || '',
    issue_date: parseDate(certification?.issue_date),
    credential_id: certification?.credential_id || '',
    credential_url: certification?.credential_url || '',
    certificate_pdf_url: certification?.certificate_pdf_url || '',
  };

  const form = useForm<CertificationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdfFile(file);
      toast({ title: 'PDF Selected', description: file.name });
    }
  };

  const onSubmit = async (values: CertificationFormValues) => {
    setIsSaving(true);
    
    const formData = new FormData();
    if (certification?.id) {
        formData.append('id', certification.id);
    }
    if (pdfFile) {
        formData.append('certificate_pdf', pdfFile);
    }
    
    // Append all other form values
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Certification Name</FormLabel>
              <FormControl><Input placeholder="e.g., Certified Kubernetes Administrator" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="issuing_organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issuing Organization</FormLabel>
              <FormControl><Input placeholder="e.g., The Linux Foundation" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="issue_date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Issue Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                      {field.value ? format(field.value, "PPP") : (<span>Pick a date</span>)}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={field.value ?? undefined} onSelect={field.onChange} initialFocus />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="credential_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Credential ID (Optional)</FormLabel>
              <FormControl><Input placeholder="e.g., LF-123456" {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="credential_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Credential URL (Optional)</FormLabel>
              <FormControl><Input type="url" placeholder="https://verify.credly.com/..." {...field} value={field.value ?? ''}/></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormItem>
          <FormLabel>Certificate PDF (Optional)</FormLabel>
          <FormControl>
            <Input type="file" accept=".pdf" onChange={handlePdfChange} />
          </FormControl>
          <FormDescription>
            {certification?.certificate_pdf_url ? (
                <a href={certification.certificate_pdf_url} target="_blank" rel="noopener noreferrer" className="text-primary underline">View current PDF</a>
            ) : "Upload a new PDF."}
          </FormDescription>
        </FormItem>

        <Button type="submit" disabled={isSaving}>
            {isSaving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div> : <SaveIcon className="mr-2 h-4 w-4" />}
            {isSaving ? 'Saving...' : 'Save Certification'}
        </Button>
      </form>
    </Form>
  );
}

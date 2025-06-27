
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, SaveIcon } from 'lucide-react';
import type { Education } from '@/lib/supabase-types';
import { upsertEducation } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { CustomSelectDate } from '../common/FormItem/CustomSelectDate';

const formSchema = z.object({
  degree: z.string().min(1, 'Degree is required'),
  institution: z.string().min(1, 'Institution is required'),
  location: z.string().optional(),
  description: z.string().optional(),
  start_date: z.date({ required_error: "A start date is required." }),
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

  const parseDate = (dateStr: string | null | undefined): Date | undefined => {
    return dateStr ? parseISO(dateStr) : undefined;
  };

  const defaultValues: Partial<EducationFormValues> = {
    degree: education?.degree || '',
    institution: education?.institution || '',
    location: education?.location || '',
    description: education?.description || '',
    start_date: parseDate(education?.start_date),
    end_date: parseDate(education?.end_date),
  };

  const form = useForm<EducationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: EducationFormValues) => {
    setIsSaving(true);
    
    const dataToSave = {
        id: education?.id,
        ...values,
        start_date: values.start_date.toISOString().substring(0, 10), // format to YYYY-MM-DD
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="degree"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Degree</FormLabel>
              <FormControl><Input placeholder="e.g., B.Sc. in Computer Science" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="institution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institution</FormLabel>
              <FormControl><Input placeholder="e.g., University of Example" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location (Optional)</FormLabel>
              <FormControl><Input placeholder="e.g., City, Country" {...field} value={field.value ?? ''}/></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl><Textarea placeholder="Describe your studies, thesis, or achievements." {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <CustomSelectDate  disabledPast={false} disabledFuture={true} field={field} label="Start Date" />
                )}
            />
            <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <CustomSelectDate formDescription="Leave blank if study is ongoing."  disabledPast={false} disabledFuture={true} field={field} label="End Date" />
                )}
            />
        </div>

        <Button type="submit" disabled={isSaving}>
            {isSaving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div> : <SaveIcon className="mr-2 h-4 w-4" />}
            {isSaving ? 'Saving...' : 'Save Education'}
        </Button>
      </form>
    </Form>
  );
}

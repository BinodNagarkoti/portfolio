
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { date, z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, SaveIcon } from 'lucide-react';
import type { Experience } from '@/lib/supabase-types';
import { upsertExperience } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { CustomSelectDate } from '../common/FormItem/CustomSelectDate';

const formSchema = z.object({
  job_title: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company is required'),
  location: z.string().optional(),
  description: z.string().optional(),
  start_date: z.date({ required_error: "A start date is required." }),
  end_date: z.date().nullable().optional(),
});

type ExperienceFormValues = z.infer<typeof formSchema>;

interface ExperienceFormProps {
  experience?: Experience | null;
  onSuccess?: () => void;
}

export function 
ExperienceForm({ experience, onSuccess }: ExperienceFormProps) {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [date, setDate] = useState<Date>()
  const parseDate = (dateStr: string | null | undefined): Date | undefined => {
    return dateStr ? parseISO(dateStr) : undefined;
  };

  const defaultValues: Partial<ExperienceFormValues> = {
    job_title: experience?.job_title || '',
    company: experience?.company || '',
    location: experience?.location || '',
    description: experience?.description || '',
    start_date: parseDate(experience?.start_date),
    end_date: parseDate(experience?.end_date),
  };

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: ExperienceFormValues) => {
    setIsSaving(true);
    
    const dataToSave = {
        id: experience?.id,
        ...values,
        start_date: values.start_date.toISOString().substring(0, 10), // format to YYYY-MM-DD
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

  return (<>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, console.log)} className="space-y-6">
        <FormField
          control={form.control}
          name="job_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl><Input placeholder="e.g., Senior Software Engineer" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company</FormLabel>
              <FormControl><Input placeholder="e.g., Google" {...field} /></FormControl>
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
              <FormControl><Input placeholder="e.g., Remote or London, UK" {...field} value={field.value ?? ''}/></FormControl>
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
              <FormControl><Textarea placeholder="Describe your role and accomplishments." {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                    <CustomSelectDate disabledPast={false} disabledFuture={true} field={field} label="Start Date" />
                  
                )}
            /> 
             <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                    <CustomSelectDate formDescription="Leave blank if this is your current role." disabledPast={false} disabledFuture={true} field={field} label="End Date" />

                )}
            /> 
            {/* <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>End Date (or leave blank)</FormLabel>
                    <Popover open={open2} onOpenChange={(_open2:boolean)=>{setOpen2(_open2)}}>
                        <PopoverTrigger asChild>
                            <Button
                            variant={"outline"}
                            className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                            >
                            {field.value ? (format(field.value, "PPP")) : (<span>Present</span>)}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 overflow-hidden" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value ?? undefined}
                            onSelect={(date)=>{field.onChange(date);setOpen2(false);}}
                        />
                        </PopoverContent>
                    </Popover>
                     <FormDescription>Leave blank if this is your current role.</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            /> */}
        </div>

        <Button type="submit" disabled={isSaving}>
            {isSaving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div> : <SaveIcon className="mr-2 h-4 w-4" />}
            {isSaving ? 'Saving...' : 'Save Experience'}
        </Button>
      </form>
    </Form>
                            </>
  );
}

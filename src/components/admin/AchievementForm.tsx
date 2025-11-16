
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
import type { Achievement } from '@/lib/supabase-types';
import { upsertAchievement } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

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

  const parseDate = (dateStr: string | null | undefined): Date | undefined => {
    return dateStr ? parseISO(dateStr) : undefined;
  };

  const defaultValues: Partial<AchievementFormValues> = {
    title: achievement?.title || '',
    description: achievement?.description || '',
    date_achieved: parseDate(achievement?.date_achieved),
  };

  const form = useForm<AchievementFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl><Input placeholder="e.g., Hackathon Winner" {...field} /></FormControl>
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
              <FormControl><Textarea placeholder="Describe the achievement." {...field} value={field.value ?? ''} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="date_achieved"
          render={({ field }) => (
              <FormItem className="flex flex-col">
              <FormLabel>Date Achieved (Optional)</FormLabel>
              <Popover>
                  <PopoverTrigger asChild>
                  <FormControl>
                      <Button
                      variant={"outline"}
                      className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                      {field.value ? (format(field.value, "PPP")) : (<span>Pick a date</span>)}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                  </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                      mode="single"
                      selected={field.value ?? undefined}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                  />
                  </PopoverContent>
              </Popover>
              <FormMessage />
              </FormItem>
          )}
        />

        <Button type="submit" disabled={isSaving}>
            {isSaving ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div> : <SaveIcon className="mr-2 h-4 w-4" />}
            {isSaving ? 'Saving...' : 'Save Achievement'}
        </Button>
      </form>
    </Form>
  );
}

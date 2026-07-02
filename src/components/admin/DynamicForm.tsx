'use client';

import React from 'react';
import { useForm, FieldValues, UseFormReturn, ControllerRenderProps } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SaveIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface FieldConfig<TFieldValues extends FieldValues> {
  name: Extract<keyof TFieldValues, string>;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'textarea' | 'number' | 'email' | 'password' | 'checkbox' | 'select' | 'custom';
  options?: { label: string; value: string }[];
  description?: string;
  className?: string; // individual field container styles
  render?: (props: {
    field: ControllerRenderProps<TFieldValues, any>;
    form: UseFormReturn<TFieldValues>;
  }) => React.ReactNode;
}

export interface FormRow<TFieldValues extends FieldValues> {
  fields: FieldConfig<TFieldValues>[];
  className?: string; // row grid override (e.g. grid-cols-3)
}

export interface FormSection<TFieldValues extends FieldValues> {
  title?: string;
  description?: string;
  rows: FormRow<TFieldValues>[];
}

interface DynamicFormProps<TFieldValues extends FieldValues> {
  schema: any;
  defaultValues: Partial<TFieldValues>;
  sections: FormSection<TFieldValues>[];
  onSubmit: (values: TFieldValues) => void | Promise<void>;
  submitButtonText?: string;
  isSaving?: boolean;
}

export function DynamicForm<TFieldValues extends FieldValues>({
  schema,
  defaultValues,
  sections,
  onSubmit,
  submitButtonText = 'Save',
  isSaving = false,
}: DynamicFormProps<TFieldValues>) {
  const form = useForm<TFieldValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  });

  const renderFieldInput = (
    config: FieldConfig<TFieldValues>,
    field: ControllerRenderProps<TFieldValues, any>
  ) => {
    if (config.render) {
      return config.render({ field, form });
    }

    switch (config.type) {
      case 'textarea':
        return <Textarea placeholder={config.placeholder} {...field} value={field.value ?? ''} />;
      case 'checkbox':
        return (
          <Checkbox
            checked={!!field.value}
            onCheckedChange={field.onChange}
            disabled={field.disabled}
          />
        );
      case 'select':
        return (
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <SelectTrigger>
              <SelectValue placeholder={config.placeholder || 'Select option'} />
            </SelectTrigger>
            <SelectContent>
              {config.options?.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'number':
        return (
          <Input
            type="number"
            placeholder={config.placeholder}
            {...field}
            onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
            value={field.value ?? ''}
          />
        );
      case 'password':
        return <Input type="password" placeholder={config.placeholder} {...field} value={field.value ?? ''} />;
      case 'email':
        return <Input type="email" placeholder={config.placeholder} {...field} value={field.value ?? ''} />;
      default:
        return <Input placeholder={config.placeholder} {...field} value={field.value ?? ''} />;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {sections.map((section, sIdx) => (
          <Card key={sIdx} className="border border-border bg-card">
            {(section.title || section.description) && (
              <CardHeader className="pb-4">
                {section.title && <CardTitle className="text-xl font-semibold">{section.title}</CardTitle>}
                {section.description && <CardDescription>{section.description}</CardDescription>}
              </CardHeader>
            )}
            <CardContent className="space-y-6 pt-4">
              {section.rows.map((row, rIdx) => {
                const colsCount = row.fields.length;
                const gridClass =
                  row.className ||
                  (colsCount === 1
                    ? 'grid grid-cols-1'
                    : colsCount === 2
                    ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                    : colsCount === 3
                    ? 'grid grid-cols-1 md:grid-cols-3 gap-6'
                    : 'grid grid-cols-1 md:grid-cols-4 gap-4');

                return (
                  <div key={rIdx} className={gridClass}>
                    {row.fields.map((fieldConfig) => (
                      <FormField
                        key={fieldConfig.name}
                        control={form.control}
                        name={fieldConfig.name as any}
                        render={({ field }) => (
                          <FormItem className={fieldConfig.className}>
                            {fieldConfig.label && <FormLabel>{fieldConfig.label}</FormLabel>}
                            <FormControl>{renderFieldInput(fieldConfig, field)}</FormControl>
                            {fieldConfig.description && (
                              <FormDescription>{fieldConfig.description}</FormDescription>
                            )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}

        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
          ) : (
            <SaveIcon className="mr-2 h-4 w-4" />
          )}
          {isSaving ? 'Saving...' : submitButtonText}
        </Button>
      </form>
    </Form>
  );
}

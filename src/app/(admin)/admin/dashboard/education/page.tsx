
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PlusCircleIcon, Trash2Icon, EditIcon } from "lucide-react";
import { getEducation, deleteEducation } from '@/lib/actions';
import type { Education } from '@/lib/supabase-types';
import { EducationForm } from '@/components/admin/EducationForm';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO } from 'date-fns';

export default function EducationAdminPage() {
  const [education, setEducation] = useState<Education[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const { toast } = useToast();

  const fetchEducation = useCallback(async () => {
    setIsLoading(true);
    const result = await getEducation();
    if (result.error) {
      toast({ variant: 'destructive', title: 'Error fetching education', description: result.error });
    } else if (result.data) {
      setEducation(result.data);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchEducation();
  }, [fetchEducation]);

  const handleEdit = (edu: Education) => {
    setEditingEducation(edu);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingEducation(null);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteEducation(id);
    if (result.error) {
      toast({ variant: 'destructive', title: 'Error deleting education', description: result.error });
    } else {
      toast({ title: 'Education record deleted' });
      await fetchEducation();
    }
  };

  const onFormSuccess = async () => {
    setDialogOpen(false);
    await fetchEducation();
  };

  const formatDateRange = (start: string, end: string | null | undefined) => {
    if (!start) return '';
    const startDate = format(parseISO(start), 'MMM yyyy');
    const endDate = end ? format(parseISO(end), 'MMM yyyy') : 'Present';
    return `${startDate} - ${endDate}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-1/4" />
            <Skeleton className="h-10 w-36" />
        </div>
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => <Card key={i}><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-4 w-full" /></CardContent></Card>)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Education</h2>
          <p className="text-muted-foreground">
            Add, edit, or remove your educational qualifications.
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Education
        </Button>
      </div>

      <div className="space-y-4">
          {education.map((edu) => (
            <Card key={edu.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{edu.degree}</CardTitle>
                        <CardDescription>{edu.institution} &bull; {edu.location}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(edu)}>
                            <EditIcon className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <AlertDialog>
                            <AlertDialogTitle asChild>
                                <Button variant="destructive" size="sm">
                                <Trash2Icon className="mr-2 h-4 w-4" /> Delete
                                </Button>
                            </AlertDialogTitle>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>This action cannot be undone. This will permanently delete this education record.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(edu.id)}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
              </CardHeader>
              {edu.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{edu.description}</p>
                </CardContent>
              )}
              <CardFooter>
                 <p className="text-xs text-muted-foreground">{formatDateRange(edu.start_date!, edu.end_date)}</p>
              </CardFooter>
            </Card>
          ))}
        </div>

      {education.length === 0 && !isLoading && (
        <Card className="text-center py-12">
            <CardContent>
                <h3 className="text-xl font-semibold">No Education Records Found</h3>
                <p className="text-muted-foreground mt-2">Click "Add Education" to get started.</p>
            </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEducation ? 'Edit Education' : 'Add New Education'}</DialogTitle>
          </DialogHeader>
          <EducationForm education={editingEducation} onSuccess={onFormSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

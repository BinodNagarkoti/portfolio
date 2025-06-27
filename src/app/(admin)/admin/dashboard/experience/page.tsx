
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PlusCircleIcon, Trash2Icon, EditIcon } from "lucide-react";
import { getExperience, deleteExperience } from '@/lib/actions';
import type { Experience } from '@/lib/supabase-types';
import { ExperienceForm } from '@/components/admin/ExperienceForm';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO } from 'date-fns';

export default function ExperienceAdminPage() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const { toast } = useToast();

  const fetchExperience = useCallback(async () => {
    setIsLoading(true);
    const result = await getExperience();
    if (result.error) {
      toast({ variant: 'destructive', title: 'Error fetching experience', description: result.error });
    } else if (result.data) {
      setExperience(result.data);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchExperience();
  }, [fetchExperience]);

  const handleEdit = (exp: Experience) => {
    setEditingExperience(exp);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingExperience(null);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteExperience(id);
    if (result.error) {
      toast({ variant: 'destructive', title: 'Error deleting experience', description: result.error });
    } else {
      toast({ title: 'Experience deleted' });
      await fetchExperience();
    }
  };

  const onFormSuccess = async () => {
    setDialogOpen(false);
    await fetchExperience();
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
          <h2 className="text-3xl font-bold tracking-tight">Manage Experience</h2>
          <p className="text-muted-foreground">
            Add, edit, or remove your professional experiences.
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Experience
        </Button>
      </div>

      <div className="space-y-4">
          {experience.map((exp) => (
            <Card key={exp.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{exp.job_title}</CardTitle>
                        <CardDescription>{exp.company} &bull; {exp.location}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(exp)}>
                            <EditIcon className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                <Trash2Icon className="mr-2 h-4 w-4" /> Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>This action cannot be undone. This will permanently delete this experience record.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(exp.id)}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{exp.description}</p>
              </CardContent>
              <CardFooter>
                 <p className="text-xs text-muted-foreground">{formatDateRange(exp.start_date!, exp.end_date)}</p>
              </CardFooter>
            </Card>
          ))}
        </div>

      {experience.length === 0 && !isLoading && (
        <Card className="text-center py-12">
            <CardContent>
                <h3 className="text-xl font-semibold">No Experience Records Found</h3>
                <p className="text-muted-foreground mt-2">Click "Add Experience" to get started.</p>
            </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingExperience ? 'Edit Experience' : 'Add New Experience'}</DialogTitle>
          </DialogHeader>
          <ExperienceForm experience={editingExperience} onSuccess={onFormSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

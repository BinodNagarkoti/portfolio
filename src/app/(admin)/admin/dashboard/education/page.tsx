
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditIcon } from "lucide-react";
import { getEducation, deleteEducation } from '@/lib/actions';
import type { Education } from '@/lib/supabase-types';
import { EducationForm } from '@/components/admin/EducationForm';
import { useToast } from '@/hooks/use-toast';
import { AdminPageSkeleton } from '@/components/admin/AdminPageSkeleton';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { formatDateRange } from '@/lib/utils';

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

  if (isLoading) return <AdminPageSkeleton />;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Manage Education"
        description="Add, edit, or remove your educational qualifications."
        buttonText="Add Education"
        onAdd={handleAddNew}
      />

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
                        <AdminDeleteDialog
                          description="This action cannot be undone. This will permanently delete this education record."
                          onConfirm={() => handleDelete(edu.id)}
                        />
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

      <AdminEmptyState
        message="No Education Records Found"
        hint='Click "Add Education" to get started.'
      />
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingEducation ? 'Edit Education' : 'Add New Education'}</DialogTitle>
          </DialogHeader>
          <EducationForm education={editingEducation} onSuccess={onFormSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

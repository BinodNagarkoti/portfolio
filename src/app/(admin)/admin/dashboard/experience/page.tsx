
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditIcon } from "lucide-react";
import { getExperience, deleteExperience } from '@/lib/actions';
import type { Experience } from '@/lib/supabase-types';
import { ExperienceForm } from '@/components/admin/ExperienceForm';
import { useToast } from '@/hooks/use-toast';
import { AdminPageSkeleton } from '@/components/admin/AdminPageSkeleton';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { formatDateRange } from '@/lib/utils';

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

  if (isLoading) return <AdminPageSkeleton />;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Manage Experience"
        description="Add, edit, or remove your professional experiences."
        buttonText="Add Experience"
        onAdd={handleAddNew}
      />

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
                        <AdminDeleteDialog
                          description="This action cannot be undone. This will permanently delete this experience record."
                          onConfirm={() => handleDelete(exp.id)}
                        />
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

      <AdminEmptyState
        message="No Experience Records Found"
        hint='Click "Add Experience" to get started.'
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingExperience ? 'Edit Experience' : 'Add New Experience'}</DialogTitle>
          </DialogHeader>
          <ExperienceForm experience={editingExperience} onSuccess={onFormSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

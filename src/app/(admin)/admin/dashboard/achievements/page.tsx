
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PlusCircleIcon, AwardIcon } from "lucide-react";
import { getAchievements, deleteAchievement } from '@/lib/actions';
import type { Achievement } from '@/lib/supabase-types';
import { AchievementForm } from '@/components/admin/AchievementForm';
import { useToast } from '@/hooks/use-toast';
import { AdminPageSkeleton } from '@/components/admin/AdminPageSkeleton';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { format, parseISO } from 'date-fns';
import { EditIcon } from 'lucide-react';

export default function AchievementsAdminPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const { toast } = useToast();

  const fetchAchievements = useCallback(async () => {
    setIsLoading(true);
    const result = await getAchievements();
    if (result.error) {
      toast({ variant: 'destructive', title: 'Error fetching achievements', description: result.error });
    } else if (result.data) {
      setAchievements(result.data);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchAchievements();
  }, [fetchAchievements]);

  const handleEdit = (ach: Achievement) => {
    setEditingAchievement(ach);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingAchievement(null);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteAchievement(id);
    if (result.error) {
      toast({ variant: 'destructive', title: 'Error deleting achievement', description: result.error });
    } else {
      toast({ title: 'Achievement record deleted' });
      await fetchAchievements();
    }
  };

  const onFormSuccess = async () => {
    setDialogOpen(false);
    await fetchAchievements();
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return '';
    return format(parseISO(date), 'PPP');
  };

  if (isLoading) return <AdminPageSkeleton />;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Manage Achievements"
        description="Add, edit, or remove your notable accomplishments."
        buttonText="Add Achievement"
        onAdd={handleAddNew}
      />

      <div className="space-y-4">
          {achievements.map((ach) => (
            <Card key={ach.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle>{ach.title}</CardTitle>
                        {ach.date_achieved && <CardDescription>{formatDate(ach.date_achieved)}</CardDescription>}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(ach)}>
                            <EditIcon className="mr-2 h-4 w-4" /> Edit
                        </Button>
                        <AdminDeleteDialog
                          description="This will permanently delete this achievement record."
                          onConfirm={() => handleDelete(ach.id)}
                        />
                    </div>
                </div>
              </CardHeader>
              {ach.description && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{ach.description}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

      {achievements.length === 0 && !isLoading && (
        <AdminEmptyState
          message="No Achievements Found"
          hint='Click "Add Achievement" to showcase your accomplishments.'
          icon={<AwardIcon className="h-12 w-12" />}
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingAchievement ? 'Edit Achievement' : 'Add New Achievement'}</DialogTitle>

          </DialogHeader>
          <AchievementForm achievement={editingAchievement} onSuccess={onFormSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

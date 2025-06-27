'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PlusCircleIcon, Trash2Icon, EditIcon, AwardIcon } from "lucide-react";
import { getAchievements, deleteAchievement } from '@/lib/actions';
import type { Achievement } from '@/lib/supabase-types';
import { AchievementForm } from '@/components/admin/AchievementForm';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO } from 'date-fns';

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
          <h2 className="text-3xl font-bold tracking-tight">Manage Achievements</h2>
          <p className="text-muted-foreground">
            Add, edit, or remove your notable accomplishments.
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Achievement
        </Button>
      </div>

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
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                <Trash2Icon className="mr-2 h-4 w-4" /> Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>This will permanently delete this achievement record.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(ach.id)}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
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
        <Card className="text-center py-12">
            <CardContent>
                <div className="flex flex-col items-center gap-4 text-muted-foreground">
                    <AwardIcon className="h-12 w-12" />
                    <h3 className="text-xl font-semibold text-foreground">No Achievements Found</h3>
                    <p>Click "Add Achievement" to showcase your accomplishments.</p>
                </div>
            </CardContent>
        </Card>
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

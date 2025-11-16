
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PlusCircleIcon, Trash2Icon, EditIcon, GripVerticalIcon } from "lucide-react";
import { getSkillCategoriesWithSkills, deleteSkill, deleteSkillCategory } from '@/lib/actions';
import type { SkillCategoryWithSkills, Skill } from '@/lib/supabase-types';
import { SkillCategoryForm, SkillForm } from '@/components/admin/SkillForms';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export default function SkillsAdminPage() {
  const [categories, setCategories] = useState<SkillCategoryWithSkills[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState<{ type: 'category' | 'skill'; open: boolean }>({ type: 'category', open: false });
  const [editingCategory, setEditingCategory] = useState<SkillCategoryWithSkills | null>(null);
  const [editingSkill, setEditingSkill] = useState<{ skill: Skill; categoryId: string; } | null>(null);
  const { toast } = useToast();

  const fetchSkills = useCallback(async () => {
    setIsLoading(true);
    const result = await getSkillCategoriesWithSkills();
    if (result.error) {
      toast({ variant: 'destructive', title: 'Error fetching skills', description: result.error });
    } else if (result.data) {
      setCategories(result.data);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const openDialog = (type: 'category' | 'skill') => setDialogOpen({ type, open: true });
  const closeDialog = () => setDialogOpen({ type: dialogOpen.type, open: false });

  const handleAddNewCategory = () => {
    setEditingCategory(null);
    openDialog('category');
  };

  const handleEditCategory = (category: SkillCategoryWithSkills) => {
    setEditingCategory(category);
    openDialog('category');
  };

  const handleDeleteCategory = async (id: string) => {
    const result = await deleteSkillCategory(id);
    if (result.error) {
      toast({ variant: 'destructive', title: 'Error deleting category', description: result.error });
    } else {
      toast({ title: 'Category deleted' });
      await fetchSkills();
    }
  };

  const handleAddNewSkill = (categoryId: string) => {
    setEditingSkill({ skill: {} as Skill, categoryId });
    openDialog('skill');
  };

  const handleEditSkill = (skill: Skill, categoryId: string) => {
    setEditingSkill({ skill, categoryId });
    openDialog('skill');
  };

  const handleDeleteSkill = async (id: string) => {
    const result = await deleteSkill(id);
    if (result.error) {
      toast({ variant: 'destructive', title: 'Error deleting skill', description: result.error });
    } else {
      toast({ title: 'Skill deleted' });
      await fetchSkills();
    }
  };

  const onFormSuccess = async () => {
    closeDialog();
    await fetchSkills();
  };

  if (isLoading) {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-1/4" />
                <Skeleton className="h-10 w-36" />
            </div>
            <Card>
                <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-3/4" />
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Skills</h2>
          <p className="text-muted-foreground">
            Organize your skills by categories and proficiency levels.
          </p>
        </div>
        <Button onClick={handleAddNewCategory}>
          <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Skill Category
        </Button>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                    <GripVerticalIcon className="h-5 w-5 text-muted-foreground" />
                    <CardTitle>{category.name}</CardTitle>
                </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                  <EditIcon className="mr-2 h-4 w-4" /> Edit Category
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm"><Trash2Icon className="h-4 w-4" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete "{category.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>This will also delete all skills in this category. This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                {category.skills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between rounded-md border p-3">
                        <div>
                            <p className="font-medium">{skill.name}</p>
                            {skill.level && <p className="text-sm text-muted-foreground">{skill.level}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditSkill(skill, category.id)}><EditIcon className="h-4 w-4" /></Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon"><Trash2Icon className="h-4 w-4 text-destructive" /></Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Delete "{skill.name}"?</AlertDialogTitle>
                                    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteSkill(skill.id)}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                ))}
                {category.skills.length === 0 && <p className="text-muted-foreground text-sm text-center py-4">No skills in this category yet.</p>}
                </div>
            </CardContent>
            <CardFooter>
              <Button variant="secondary" size="sm" onClick={() => handleAddNewSkill(category.id)}>
                <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Skill to "{category.name}"
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {categories.length === 0 && !isLoading && (
        <Card className="text-center py-12">
            <CardContent>
                <h3 className="text-xl font-semibold">No Skill Categories Found</h3>
                <p className="text-muted-foreground mt-2">Click "Add Skill Category" to get started.</p>
            </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen.open} onOpenChange={(open) => setDialogOpen({ ...dialogOpen, open })}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
                {dialogOpen.type === 'category' 
                    ? (editingCategory ? 'Edit Category' : 'Add New Category')
                    : (editingSkill?.skill.id ? 'Edit Skill' : 'Add New Skill')
                }
            </DialogTitle>
          </DialogHeader>
          {dialogOpen.type === 'category' ? (
              <SkillCategoryForm category={editingCategory} onSuccess={onFormSuccess} />
          ) : (
              editingSkill && <SkillForm skill={editingSkill.skill} categoryId={editingSkill.categoryId} onSuccess={onFormSuccess} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

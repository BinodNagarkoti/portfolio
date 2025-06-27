
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { PlusCircleIcon, Trash2Icon, EditIcon } from "lucide-react";
import { getProjectsForAdmin, deleteProject } from '@/lib/actions';
import type { Project } from '@/lib/supabase-types';
import { ProjectForm } from '@/components/admin/ProjectForm';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { toast } = useToast();

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    const result = await getProjectsForAdmin();
    if (result.error) {
      toast({ variant: 'destructive', title: 'Error fetching projects', description: result.error });
    } else if (result.data) {
      setProjects(result.data);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingProject(null);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteProject(id);
    if (result.error) {
      toast({ variant: 'destructive', title: 'Error deleting project', description: result.error });
    } else {
      toast({ title: 'Project deleted' });
      await fetchProjects();
    }
  };

  const onFormSuccess = async () => {
    setDialogOpen(false);
    await fetchProjects();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Projects</h2>
          <p className="text-muted-foreground">
            Add, edit, or remove your portfolio projects.
          </p>
        </div>
        <Button onClick={handleAddNew}>
          <PlusCircleIcon className="mr-2 h-4 w-4" /> Add New Project
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader>
              <CardContent><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-1/2 mt-2" /></CardContent>
              <CardFooter><Skeleton className="h-8 w-24" /></CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                 {project.cover_image_url ? (
                  <div className="aspect-video relative mb-4">
                    <Image src={project.cover_image_url} alt={project.title} fill className="object-cover rounded-md" />
                  </div>
                ) : (
                  <div className="aspect-video bg-secondary rounded-md mb-4 flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">No Image</p>
                  </div>
                )}
                <CardTitle>{project.title}</CardTitle>
                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground mb-2">Technologies:</p>
                <div className="flex flex-wrap gap-1">
                  {project.technologies?.map(tech => (
                    <span key={tech} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 justify-end">
                <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
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
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the project from your portfolio.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(project.id)}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {projects.length === 0 && !isLoading && (
        <Card className="text-center py-12">
            <CardContent>
                <h3 className="text-xl font-semibold">No Projects Found</h3>
                <p className="text-muted-foreground mt-2">Click "Add New Project" to get started.</p>
            </CardContent>
        </Card>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProject ? 'Edit Project' : 'Add New Project'}</DialogTitle>
          </DialogHeader>
          <ProjectForm project={editingProject} onSuccess={onFormSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

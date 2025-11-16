'use client';

import { useState, useEffect, useCallback } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EyeIcon, Trash2Icon, RefreshCwIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { getContactSubmissions, updateContactSubmissionReadStatus, deleteContactSubmission } from '@/lib/actions';
import type { ContactSubmission } from '@/lib/supabase-types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO } from 'date-fns';

export default function ContactSubmissionsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchSubmissions = useCallback(async () => {
    setIsLoading(true);
    const result = await getContactSubmissions();
    if (result.error) {
      toast({ variant: 'destructive', title: 'Error fetching submissions', description: result.error });
    } else if (result.data) {
      setSubmissions(result.data);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleView = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setDialogOpen(true);
    if (!submission.is_read) {
      handleMarkAsRead(submission.id, true);
    }
  };

  const handleMarkAsRead = async (id: string, is_read: boolean) => {
    await updateContactSubmissionReadStatus(id, is_read);
    fetchSubmissions(); // Re-fetch to update the UI
  };

  const handleDelete = async (id: string) => {
    const result = await deleteContactSubmission(id);
    if (result.error) {
      toast({ variant: 'destructive', title: 'Error deleting submission', description: result.error });
    } else {
      toast({ title: 'Submission deleted' });
      await fetchSubmissions();
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Contact Form Submissions</h2>
              <p className="text-muted-foreground">Loading messages...</p>
            </div>
            <Skeleton className="h-10 w-28" />
        </div>
        <Card>
            <CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Contact Form Submissions</h2>
          <p className="text-muted-foreground">
            View messages sent through your portfolio's contact form.
          </p>
        </div>
        <Button onClick={() => fetchSubmissions()} variant="outline" disabled={isLoading}>
          <RefreshCwIcon className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>
            Messages from potential clients and collaborators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Message (Excerpt)</TableHead>
                <TableHead className="text-right">Received</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((submission) => (
                <TableRow key={submission.id} className={!submission.is_read ? "font-bold bg-primary/5" : ""}>
                  <TableCell>
                    <Badge variant={submission.is_read ? "outline" : "default"}>
                      {submission.is_read ? "Read" : "New"}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">{submission.name}</TableCell>
                  <TableCell className={!submission.is_read ? "" : "font-normal"}>{submission.email}</TableCell>
                  <TableCell className="max-w-xs truncate font-normal">{submission.message}</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground font-normal">
                    {format(parseISO(submission.submitted_at), 'PPP p')}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleView(submission)}><EyeIcon className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon"><Trash2Icon className="h-4 w-4 text-destructive" /></Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>This will permanently delete this message.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(submission.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {submissions.length === 0 && !isLoading && (
            <div className="text-center py-12">
                <h3 className="text-xl font-semibold">No Submissions Found</h3>
                <p className="text-muted-foreground mt-2">Your inbox is empty.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Message from: {selectedSubmission?.name}</DialogTitle>
            <DialogDescription>
              {selectedSubmission?.email} &bull; Received on {selectedSubmission && format(parseISO(selectedSubmission.submitted_at), 'PPP p')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 whitespace-pre-wrap text-sm">
            {selectedSubmission?.message}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

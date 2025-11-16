
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderKanbanIcon, MessageSquareIcon, PenSquareIcon, AlertTriangleIcon } from "lucide-react";
import { getProjectsForAdmin, getPosts, getContactSubmissions } from "@/lib/actions";
import type { ContactSubmission } from "@/lib/supabase-types";
import { format, parseISO } from 'date-fns';

interface DashboardStats {
  projects: number;
  posts: number;
  unreadSubmissions: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentSubmissions, setRecentSubmissions] = useState<ContactSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [projectsResult, postsResult, submissionsResult] = await Promise.all([
        getProjectsForAdmin(),
        getPosts({ admin: true }),
        getContactSubmissions()
      ]);

      if (projectsResult.error || postsResult.error || submissionsResult.error) {
        throw new Error('Failed to fetch some dashboard data.');
      }
      
      const projectsCount = projectsResult.data?.length ?? 0;
      const postsCount = postsResult.data?.length ?? 0;
      const unreadCount = submissionsResult.data?.filter(s => !s.is_read).length ?? 0;
      
      setStats({
        projects: projectsCount,
        posts: postsCount,
        unreadSubmissions: unreadCount
      });
      
      setRecentSubmissions(submissionsResult.data?.slice(0, 5) ?? []);

    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
      console.error("Dashboard fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <Card className="max-w-md bg-destructive/10 border-destructive/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangleIcon /> Dashboard Error
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-destructive/90">{error}</p>
                    <p className="text-muted-foreground mt-2 text-sm">Please check the database connection and permissions.</p>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderKanbanIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.projects ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
            <PenSquareIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.posts ?? 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Submissions</CardTitle>
            <MessageSquareIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.unreadSubmissions ?? 0}</div>
             <p className="text-xs text-muted-foreground">Unread messages</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Submissions</CardTitle>
          <CardDescription>The last 5 messages from your contact form.</CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Sender</TableHead>
                <TableHead className="hidden md:table-cell">Received</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentSubmissions.length > 0 ? recentSubmissions.map(s => (
                <TableRow key={s.id} className={!s.is_read ? "font-bold" : ""}>
                   <TableCell>
                    <Badge variant={s.is_read ? "outline" : "default"}>
                      {s.is_read ? "Read" : "New"}
                    </Badge>
                  </TableCell>
                  <TableCell>{s.name}</TableCell>
                  <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                    {format(parseISO(s.submitted_at), 'PPP p')}
                  </TableCell>
                </TableRow>
              )) : (
                 <TableRow>
                    <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                        No submissions yet.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
           </Table>
        </CardContent>
      </Card>

    </div>
  );
}

const DashboardSkeleton = () => (
    <div className="space-y-6">
      <Skeleton className="h-10 w-1/2" />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader>
          <CardContent><Skeleton className="h-8 w-1/3" /></CardContent>
        </Card>
        <Card>
          <CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader>
          <CardContent><Skeleton className="h-8 w-1/3" /></CardContent>
        </Card>
        <Card>
          <CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader>
          <CardContent><Skeleton className="h-8 w-1/3" /></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
);


'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EditIcon, StarIcon, ExternalLinkIcon } from "lucide-react";
import { getCertifications, deleteCertification } from '@/lib/actions';
import type { Certification } from '@/lib/supabase-types';
import { CertificationForm } from '@/components/admin/CertificationForm';
import { useToast } from '@/hooks/use-toast';
import { AdminPageSkeleton } from '@/components/admin/AdminPageSkeleton';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminDeleteDialog } from '@/components/admin/AdminDeleteDialog';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { format, parseISO } from 'date-fns';
import Link from 'next/link';

export default function CertificationsAdminPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const { toast } = useToast();

  const fetchCertifications = useCallback(async () => {
    setIsLoading(true);
    const result = await getCertifications();
    if (result.error) {
      toast({ variant: 'destructive', title: 'Error fetching certifications', description: result.error });
    } else if (result.data) {
      setCertifications(result.data);
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchCertifications();
  }, [fetchCertifications]);

  const handleEdit = (cert: Certification) => {
    setEditingCertification(cert);
    setDialogOpen(true);
  };

  const handleAddNew = () => {
    setEditingCertification(null);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const result = await deleteCertification(id);
    if (result.error) {
      toast({ variant: 'destructive', title: 'Error deleting certification', description: result.error });
    } else {
      toast({ title: 'Certification deleted' });
      await fetchCertifications();
    }
  };

  const onFormSuccess = async () => {
    setDialogOpen(false);
    await fetchCertifications();
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return 'N/A';
    return format(parseISO(date), 'PPP');
  };
  
  if (isLoading) return <AdminPageSkeleton />;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Manage Certifications"
        description="List your certifications and upload relevant documents."
        buttonText="Add Certification"
        onAdd={handleAddNew}
      />

      <div className="space-y-4">
        {certifications.map((cert) => (
          <Card key={cert.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{cert.name}</CardTitle>
                  <CardDescription>{cert.issuing_organization}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(cert)}>
                    <EditIcon className="mr-2 h-4 w-4" /> Edit
                  </Button>
                  <AdminDeleteDialog
                    description="This will permanently delete this certification record."
                    onConfirm={() => handleDelete(cert.id)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Issued on:</strong> {formatDate(cert.issue_date)}</p>
              {cert.credential_id && <p><strong>Credential ID:</strong> {cert.credential_id}</p>}
              <div className="flex gap-4 items-center">
                {cert.credential_url && (
                  <Link href={cert.credential_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="link" className="p-0 h-auto">Verify Credential <ExternalLinkIcon className="ml-2 h-4 w-4" /></Button>
                  </Link>
                )}
                {cert.certificate_pdf_url && (
                  <Link href={cert.certificate_pdf_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="link" className="p-0 h-auto">View PDF <ExternalLinkIcon className="ml-2 h-4 w-4" /></Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {certifications.length === 0 && !isLoading && (
        <AdminEmptyState
          message="No Certifications Found"
          hint='Click "Add Certification" to showcase your credentials.'
          icon={<StarIcon className="h-12 w-12" />}
        />
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCertification ? 'Edit Certification' : 'Add New Certification'}</DialogTitle>
          </DialogHeader>
          <CertificationForm certification={editingCertification} onSuccess={onFormSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

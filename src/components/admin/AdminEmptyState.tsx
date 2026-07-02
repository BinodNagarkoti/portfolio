import { Card, CardContent } from '@/components/ui/card';
import { ReactNode } from 'react';

interface AdminEmptyStateProps {
  message: string;
  hint: string;
  icon?: ReactNode;
}

export function AdminEmptyState({ message, hint, icon }: AdminEmptyStateProps) {
  return (
    <Card className="text-center py-12">
      <CardContent>
        {icon ? (
          <div className="flex flex-col items-center gap-4 text-muted-foreground">
            {icon}
            <h3 className="text-xl font-semibold text-foreground">{message}</h3>
            <p>{hint}</p>
          </div>
        ) : (
          <>
            <h3 className="text-xl font-semibold">{message}</h3>
            <p className="text-muted-foreground mt-2">{hint}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

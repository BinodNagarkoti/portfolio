import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface AdminPageSkeletonProps {
  count?: number;
}

export function AdminPageSkeleton({ count = 2 }: AdminPageSkeletonProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-10 w-36" />
      </div>
      <div className="space-y-4">
        {[...Array(count)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

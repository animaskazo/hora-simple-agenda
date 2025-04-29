
import { Skeleton } from "@/components/ui/skeleton";

export const LoadingState = () => {
  return (
    <div className="space-y-3">
      <Skeleton className="h-8 w-64 mb-4" />
      <Skeleton className="h-32 w-full rounded-md" />
    </div>
  );
};


import { CalendarX } from "lucide-react";

interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="bg-muted p-6 rounded-md text-center flex flex-col items-center">
      <CalendarX className="h-12 w-12 text-muted-foreground mb-3" />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
};

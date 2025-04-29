
interface EmptyStateProps {
  message: string;
}

export const EmptyState = ({ message }: EmptyStateProps) => {
  return (
    <div className="bg-muted p-4 rounded-md text-center">
      {message}
    </div>
  );
};

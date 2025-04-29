
import { Button } from "@/components/ui/button";
import { Availability } from "./types";

interface AvailabilityBlockProps {
  block: Availability;
  onRemove: (id: string) => void;
}

export const AvailabilityBlock = ({ block, onRemove }: AvailabilityBlockProps) => {
  const formatTimeBlock = (block: Availability) => {
    return `${block.startHour.toString().padStart(2, '0')}:${block.startMinute.toString().padStart(2, '0')} - ${block.endHour.toString().padStart(2, '0')}:${block.endMinute.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex justify-between items-center bg-accent p-3 rounded-md">
      <span>{formatTimeBlock(block)}</span>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => onRemove(block.id)}
        className="h-8 w-8 p-0"
      >
        ×
      </Button>
    </div>
  );
};

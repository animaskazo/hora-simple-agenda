
import { Availability } from "./types";

interface AvailabilityListProps {
  blocks: Availability[];
  onRemove: (id: string) => void;
}

export const AvailabilityList = ({ blocks, onRemove }: AvailabilityListProps) => {
  const formatTimeBlock = (block: Availability) => {
    return `${block.startHour.toString().padStart(2, '0')}:${block.startMinute.toString().padStart(2, '0')} - ${block.endHour.toString().padStart(2, '0')}:${block.endMinute.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-2 mb-4">
      {blocks.map(block => (
        <div 
          key={block.id} 
          className="flex justify-between items-center bg-accent p-3 rounded-md"
        >
          <span>{formatTimeBlock(block)}</span>
          <button 
            onClick={() => onRemove(block.id)}
            className="h-8 w-8 p-0 rounded-full hover:bg-background/20"
          >
            ×
          </button>
        </div>
      ))}
      
      {blocks.length === 0 && (
        <div className="text-center py-2 text-muted-foreground">
          No hay disponibilidad configurada para este día
        </div>
      )}
    </div>
  );
};

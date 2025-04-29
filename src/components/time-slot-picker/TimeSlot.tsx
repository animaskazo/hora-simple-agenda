
import { Button } from "@/components/ui/button";

export interface TimeSlotData {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  available: boolean;
}

interface TimeSlotProps {
  slot: TimeSlotData;
  isSelected: boolean;
  onSelect: (slot: TimeSlotData) => void;
}

export const TimeSlot = ({ slot, isSelected, onSelect }: TimeSlotProps) => {
  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      className={isSelected ? "" : "bg-accent text-accent-foreground"}
      onClick={() => onSelect(slot)}
    >
      {slot.startTime} - {slot.endTime}
    </Button>
  );
};

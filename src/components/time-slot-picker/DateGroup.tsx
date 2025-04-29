
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TimeSlot, TimeSlotData } from "./TimeSlot";

interface DateGroupProps {
  dateKey: string;
  slots: TimeSlotData[];
  selectedSlotId: string | null;
  onSelectSlot: (slot: TimeSlotData) => void;
}

export const DateGroup = ({ dateKey, slots, selectedSlotId, onSelectSlot }: DateGroupProps) => {
  const availableSlots = slots.filter((slot) => slot.available);
  const sortedSlots = availableSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));
  
  const date = new Date(dateKey);
  const formattedDate = format(date, "EEEE d 'de' MMMM", { locale: es });
  
  return (
    <div className="border rounded-md p-4">
      <h4 className="font-medium mb-3 capitalize">{formattedDate}</h4>
      <div className="grid grid-cols-3 gap-2">
        {sortedSlots.map((slot) => (
          <TimeSlot
            key={slot.id}
            slot={slot}
            isSelected={selectedSlotId === slot.id}
            onSelect={onSelectSlot}
          />
        ))}
      </div>
    </div>
  );
};

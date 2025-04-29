
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
  const dayNumber = format(date, "d");
  const dayName = format(date, "EEEE", { locale: es });
  
  return (
    <div className="border rounded-md p-4">
      <h4 className="font-medium mb-2 flex items-center">
        <span className="bg-primary text-white w-8 h-8 flex items-center justify-center rounded-full mr-2 text-base">
          {dayNumber}
        </span>
        <span className="capitalize">
          {dayName}, {format(date, "d 'de' MMMM 'de' yyyy", { locale: es })}
        </span>
      </h4>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {sortedSlots.length > 0 ? (
          sortedSlots.map((slot) => (
            <TimeSlot
              key={slot.id}
              slot={slot}
              isSelected={selectedSlotId === slot.id}
              onSelect={onSelectSlot}
            />
          ))
        ) : (
          <div className="col-span-full text-sm text-muted-foreground">
            No hay horarios disponibles para este día.
          </div>
        )}
      </div>
    </div>
  );
};

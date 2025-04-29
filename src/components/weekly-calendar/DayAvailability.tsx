
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Availability } from "./types";
import { AvailabilityBlock } from "./AvailabilityBlock";
import { AvailabilityForm } from "./AvailabilityForm";
import { weekDays } from "./WeekDaySelector";

interface DayAvailabilityProps {
  selectedDay: number;
  availability: Availability[];
  onAddBlock: (startHour: string, endHour: string) => void;
  onRemoveBlock: (id: string) => void;
}

export const DayAvailability = ({ 
  selectedDay, 
  availability, 
  onAddBlock, 
  onRemoveBlock 
}: DayAvailabilityProps) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  
  // Get day blocks for the selected day
  const dayBlocks = availability.filter(block => block.dayOfWeek === selectedDay);
  
  // Get the selected day name
  const selectedDayName = weekDays.find(d => d.number === selectedDay)?.name || "Día seleccionado";
  
  const handleSave = (startHour: string, endHour: string) => {
    onAddBlock(startHour, endHour);
    setIsEditing(false);
  };
  
  return (
    <div className="mt-4 border rounded-md p-4">
      <h3 className="text-lg font-medium mb-4 capitalize">
        {selectedDayName}
      </h3>
      
      <div className="space-y-2 mb-4">
        {dayBlocks.map(block => (
          <AvailabilityBlock 
            key={block.id} 
            block={block} 
            onRemove={onRemoveBlock} 
          />
        ))}
        
        {dayBlocks.length === 0 && (
          <div className="text-center py-2 text-muted-foreground">
            No hay disponibilidad configurada para este día
          </div>
        )}
      </div>
      
      {isEditing ? (
        <AvailabilityForm 
          selectedDay={selectedDay}
          onCancel={() => setIsEditing(false)}
          onSave={handleSave}
        />
      ) : (
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={() => setIsEditing(true)}
        >
          + Añadir bloque de disponibilidad
        </Button>
      )}
    </div>
  );
};

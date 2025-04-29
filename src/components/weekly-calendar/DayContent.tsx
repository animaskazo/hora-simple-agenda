
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Availability } from "./types";
import { AvailabilityEditor } from "./AvailabilityEditor";
import { weekDays } from "./WeekDaySelector";
import { AvailabilityList } from "./AvailabilityList";

interface DayContentProps {
  selectedDay: number;
  availability: Availability[];
  onAddBlock: (startHour: string, endHour: string) => void;
  onRemoveBlock: (id: string) => void;
}

export const DayContent = ({ 
  selectedDay, 
  availability, 
  onAddBlock, 
  onRemoveBlock 
}: DayContentProps) => {
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
      
      <AvailabilityList 
        blocks={dayBlocks} 
        onRemove={onRemoveBlock} 
      />
      
      {isEditing ? (
        <AvailabilityEditor 
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

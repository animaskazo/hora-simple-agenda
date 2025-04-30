
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { WeeklyCalendarProps, Availability } from "./types";
import { WeekDaySelector } from "./WeekDaySelector";
import { DayContent } from "./DayContent";

const WeeklyCalendar = ({ onAvailabilityChange, initialAvailability = [] }: WeeklyCalendarProps) => {
  const [selectedDay, setSelectedDay] = useState<number>(1); // Start on Monday (1)
  const [availability, setAvailability] = useState<Availability[]>(initialAvailability);
  
  useEffect(() => {
    // Update local state when initial availability props change
    if (initialAvailability.length > 0) {
      setAvailability(initialAvailability);
    }
  }, [initialAvailability]);

  const handleAddBlock = (startHour: string, endHour: string) => {
    if (!startHour || !endHour) return;
    
    const [startHourVal, startMinuteVal] = startHour.split(":").map(Number);
    const [endHourVal, endMinuteVal] = endHour.split(":").map(Number);
    
    if (startHourVal > endHourVal || 
       (startHourVal === endHourVal && startMinuteVal >= endMinuteVal)) {
      alert("La hora de inicio debe ser anterior a la hora de fin");
      return;
    }
    
    const newBlock: Availability = {
      id: `${selectedDay}-${startHour}-${endHour}-${Date.now()}`,
      dayOfWeek: selectedDay,
      startHour: startHourVal,
      startMinute: startMinuteVal,
      endHour: endHourVal,
      endMinute: endMinuteVal,
    };
    
    const newAvailability = [...availability, newBlock];
    setAvailability(newAvailability);
    onAvailabilityChange(newAvailability);
  };

  const handleRemoveBlock = (id: string) => {
    const newAvailability = availability.filter(block => block.id !== id);
    setAvailability(newAvailability);
    onAvailabilityChange(newAvailability);
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="font-medium flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>Disponibilidad Semanal</span>
          </div>
        </div>
        
        <WeekDaySelector 
          selectedDay={selectedDay} 
          onSelectDay={setSelectedDay} 
        />
        
        <DayContent
          selectedDay={selectedDay}
          availability={availability}
          onAddBlock={handleAddBlock}
          onRemoveBlock={handleRemoveBlock}
        />
      </CardContent>
    </Card>
  );
};

export default WeeklyCalendar;
export { type Availability } from "./types";

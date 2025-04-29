
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, addDays, startOfWeek, isEqual } from "date-fns";
import { es } from "date-fns/locale";

export interface Availability {
  id: string;
  dayOfWeek: number; // 0 = domingo, 1 = lunes, etc.
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

interface WeeklyCalendarProps {
  onAvailabilityChange: (availability: Availability[]) => void;
  initialAvailability?: Availability[];
}

const WeeklyCalendar = ({ onAvailabilityChange, initialAvailability = [] }: WeeklyCalendarProps) => {
  const [selectedDay, setSelectedDay] = useState<number>(1); // Iniciar en lunes (1)
  const [availability, setAvailability] = useState<Availability[]>(initialAvailability);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [startHour, setStartHour] = useState<string>("09:00");
  const [endHour, setEndHour] = useState<string>("18:00");
  const [currentWeekStartDate, setCurrentWeekStartDate] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  useEffect(() => {
    // Actualizar el estado local cuando cambian las props de disponibilidad inicial
    if (initialAvailability.length > 0) {
      setAvailability(initialAvailability);
    }
  }, [initialAvailability]);

  // Horas para selector
  const hours = Array.from({ length: 24 }, (_, i) => 
    `${i.toString().padStart(2, '0')}:00`
  );

  // Días de la semana con fecha actual
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(currentWeekStartDate, i);
    return {
      number: i + 1,
      name: format(date, 'EEEE', { locale: es }),
      shortName: format(date, 'EEE', { locale: es }),
      dayOfMonth: format(date, 'd'), // Día del mes como número
      date: date,
    };
  });

  const handleAddBlock = () => {
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
    setIsEditing(false);
  };

  const handleRemoveBlock = (id: string) => {
    const newAvailability = availability.filter(block => block.id !== id);
    setAvailability(newAvailability);
    onAvailabilityChange(newAvailability);
  };

  const formatTimeBlock = (block: Availability) => {
    return `${block.startHour.toString().padStart(2, '0')}:${block.startMinute.toString().padStart(2, '0')} - ${block.endHour.toString().padStart(2, '0')}:${block.endMinute.toString().padStart(2, '0')}`;
  };

  const selectedDayInfo = weekDays.find(day => day.number === selectedDay);

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {weekDays.map(day => (
            <Button
              key={day.number}
              variant={day.number === selectedDay ? "default" : "outline"}
              onClick={() => setSelectedDay(day.number)}
              className="flex-1 min-w-[70px] flex flex-col items-center"
            >
              <span className="flex items-center justify-center bg-primary/10 rounded-full w-6 h-6 mb-1 text-sm font-medium">
                {day.dayOfMonth}
              </span>
              <span className="hidden sm:inline capitalize">{day.name}</span>
              <span className="sm:hidden capitalize">{day.shortName}</span>
            </Button>
          ))}
        </div>
        
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium">
            Bloques de disponibilidad - {selectedDayInfo ? (
              <span className="capitalize">
                {selectedDayInfo.name} {selectedDayInfo.dayOfMonth}
              </span>
            ) : 'Seleccione un día'}
          </h3>
          
          {availability
            .filter(block => block.dayOfWeek === selectedDay)
            .map(block => (
              <div 
                key={block.id} 
                className="flex justify-between items-center p-3 bg-accent rounded-md"
              >
                <span>{formatTimeBlock(block)}</span>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRemoveBlock(block.id)}
                >
                  Eliminar
                </Button>
              </div>
            ))}
          
          {availability.filter(block => block.dayOfWeek === selectedDay).length === 0 && (
            <p className="text-muted-foreground text-sm">
              No hay bloques configurados para este día
            </p>
          )}
          
          {isEditing ? (
            <div className="mt-4 border rounded-md p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Hora inicio</label>
                  <select 
                    value={startHour}
                    onChange={e => setStartHour(e.target.value)}
                    className="w-full p-2 border rounded-md mt-1"
                  >
                    {hours.map(hour => (
                      <option key={`start-${hour}`} value={hour}>{hour}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Hora fin</label>
                  <select 
                    value={endHour}
                    onChange={e => setEndHour(e.target.value)}
                    className="w-full p-2 border rounded-md mt-1"
                  >
                    {hours.map(hour => (
                      <option key={`end-${hour}`} value={hour}>{hour}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddBlock}>
                  Guardar
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              variant="outline" 
              className="w-full mt-2" 
              onClick={() => setIsEditing(true)}
            >
              + Añadir bloque de disponibilidad
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyCalendar;

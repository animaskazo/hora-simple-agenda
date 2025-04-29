
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, addDays, startOfWeek, setHours, setMinutes } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock } from "lucide-react";

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

  // Días de la semana
  const weekDays = [
    { number: 1, name: "lunes", shortName: "lun" },
    { number: 2, name: "martes", shortName: "mar" },
    { number: 3, name: "miércoles", shortName: "mié" },
    { number: 4, name: "jueves", shortName: "jue" },
    { number: 5, name: "viernes", shortName: "vie" },
    { number: 6, name: "sábado", shortName: "sáb" },
    { number: 0, name: "domingo", shortName: "dom" },
  ];

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

  // Obtener los bloques para un día específico
  const getDayBlocks = (dayOfWeek: number) => {
    return availability.filter(block => block.dayOfWeek === dayOfWeek);
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
        
        <div className="grid grid-cols-7 gap-2 mb-6">
          {weekDays.map(day => (
            <Button
              key={day.number}
              variant={selectedDay === day.number ? "default" : "outline"}
              className="w-full capitalize"
              onClick={() => setSelectedDay(day.number)}
            >
              {day.shortName}
            </Button>
          ))}
        </div>
        
        <div className="mt-4 border rounded-md p-4">
          <h3 className="text-lg font-medium mb-4 capitalize">
            {weekDays.find(d => d.number === selectedDay)?.name || "Día seleccionado"}
          </h3>
          
          <div className="space-y-2 mb-4">
            {getDayBlocks(selectedDay).map(block => (
              <div 
                key={block.id} 
                className="flex justify-between items-center bg-accent p-3 rounded-md"
              >
                <span>{formatTimeBlock(block)}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleRemoveBlock(block.id)}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>
            ))}
            
            {getDayBlocks(selectedDay).length === 0 && (
              <div className="text-center py-2 text-muted-foreground">
                No hay disponibilidad configurada para este día
              </div>
            )}
          </div>
          
          {isEditing ? (
            <div className="space-y-4">
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
              className="w-full" 
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

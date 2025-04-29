
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format, addDays, startOfWeek, isEqual } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar, Clock } from "lucide-react";
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";

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

  // Obtener los bloques para un día específico
  const getDayBlocks = (dayOfWeek: number) => {
    return availability.filter(block => block.dayOfWeek === dayOfWeek);
  };

  const renderWeeklyView = () => {
    return (
      <div className="mt-6">
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(day => (
            <div key={day.number} 
              className="text-center font-medium py-2">
              <div className="flex flex-col items-center">
                <span className="text-xs text-muted-foreground uppercase">{day.shortName}</span>
                <span className="h-7 w-7 rounded-full bg-accent flex items-center justify-center mt-1">
                  {day.dayOfMonth}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1 mt-2 relative availability-grid">
          {weekDays.map(day => {
            const dayBlocks = getDayBlocks(day.number);
            const hasBlocks = dayBlocks.length > 0;
            
            return (
              <div key={day.number}
                className={`min-h-[100px] border rounded-md p-2 relative ${selectedDay === day.number ? 'border-primary' : 'border-border'}`}
                onClick={() => setSelectedDay(day.number)}
              >
                {hasBlocks ? (
                  <div className="space-y-1">
                    {dayBlocks.map(block => (
                      <div 
                        key={block.id} 
                        className="text-xs bg-primary text-primary-foreground p-1 rounded flex justify-between items-center"
                      >
                        <span>{formatTimeBlock(block)}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveBlock(block.id);
                          }}
                          className="text-primary-foreground hover:text-white ml-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">No disponible</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const selectedDayInfo = weekDays.find(day => day.number === selectedDay);

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="font-medium flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            <span>Vista semanal</span>
          </div>
          <ToggleGroup type="single" value={selectedDay.toString()} onValueChange={(value) => value && setSelectedDay(Number(value))}>
            {weekDays.map(day => (
              <ToggleGroupItem key={day.number} value={day.number.toString()} className="px-2" aria-label={day.name}>
                <span className="hidden sm:inline capitalize">{day.shortName}</span>
                <span className="sm:hidden">{day.dayOfMonth}</span>
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        
        {renderWeeklyView()}
        
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <span>
              Disponibilidad - {selectedDayInfo ? (
                <span className="capitalize">
                  {selectedDayInfo.name} {selectedDayInfo.dayOfMonth}
                </span>
              ) : 'Seleccione un día'}
            </span>
          </h3>
          
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

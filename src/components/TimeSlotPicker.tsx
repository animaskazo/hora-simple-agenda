
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { format, addDays, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";

interface TimeSlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  available: boolean;
}

interface TimeSlotPickerProps {
  doctorId: string;
  onSelect: (slot: TimeSlot) => void;
}

// Datos de ejemplo, en una app real vendrían de una API
const generateMockTimeSlots = (doctorId: string): TimeSlot[] => {
  const today = startOfWeek(new Date(), { weekStartsOn: 1 });
  const slots: TimeSlot[] = [];
  
  const times = ["09:00", "10:00", "11:00", "12:00", "15:00", "16:00", "17:00"];
  
  // Generar slots para 7 días
  for (let day = 0; day < 7; day++) {
    const currentDate = addDays(today, day);
    
    // Para cada día, generar slots de tiempo
    times.forEach((time, index) => {
      // Calcular hora de fin (1 hora después)
      const hourParts = time.split(':');
      let endHour = parseInt(hourParts[0]) + 1;
      let endTime = `${endHour.toString().padStart(2, '0')}:${hourParts[1]}`;
      
      // Añadir slot con 70% de probabilidad de estar disponible
      slots.push({
        id: `${doctorId}-${day}-${index}`,
        date: currentDate,
        startTime: time,
        endTime: endTime,
        available: Math.random() > 0.3, // 70% disponible, 30% ocupado
      });
    });
  }
  
  return slots;
};

const TimeSlotPicker = ({ doctorId, onSelect }: TimeSlotPickerProps) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (doctorId) {
      // Simulamos la carga de datos desde una API
      setIsLoading(true);
      setTimeout(() => {
        const slots = generateMockTimeSlots(doctorId);
        setTimeSlots(slots);
        setSelectedSlot(null); // Reset selection when doctor changes
        setIsLoading(false);
      }, 500);
    } else {
      setTimeSlots([]);
    }
  }, [doctorId]);

  const handleSelectSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot.id);
    onSelect(slot);
  };

  if (!doctorId) {
    return (
      <div className="bg-muted p-4 rounded-md text-center">
        Por favor, selecciona un médico para ver su disponibilidad.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-muted p-4 rounded-md text-center">
        Cargando disponibilidad...
      </div>
    );
  }

  // Agrupar slots por día
  const slotsByDay = timeSlots.reduce((acc, slot) => {
    const dateKey = format(slot.date, "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Horarios disponibles</h3>
      
      {Object.keys(slotsByDay).length === 0 ? (
        <div className="bg-muted p-4 rounded-md text-center">
          No hay horarios disponibles para este médico.
        </div>
      ) : (
        Object.entries(slotsByDay).map(([dateKey, slots]) => (
          <div key={dateKey} className="border rounded-md p-4">
            <h4 className="font-medium mb-2">
              {format(new Date(dateKey), "EEEE d 'de' MMMM", { locale: es })}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {slots
                .filter((slot) => slot.available)
                .map((slot) => (
                  <Button
                    key={slot.id}
                    variant={selectedSlot === slot.id ? "default" : "outline"}
                    className={selectedSlot === slot.id ? "" : "bg-accent text-accent-foreground"}
                    onClick={() => handleSelectSlot(slot)}
                  >
                    {slot.startTime} - {slot.endTime}
                  </Button>
                ))}
              {slots.filter((slot) => slot.available).length === 0 && (
                <div className="col-span-full text-sm text-muted-foreground">
                  No hay horarios disponibles para este día.
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TimeSlotPicker;


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { format, addDays, startOfWeek, setHours, setMinutes, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

interface TimeSlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  available: boolean;
}

interface DoctorAvailability {
  id: string;
  day_of_week: number;
  start_hour: number;
  start_minute: number;
  end_hour: number;
  end_minute: number;
}

interface TimeSlotPickerProps {
  doctorId: string;
  onSelect: (slot: TimeSlot) => void;
}

const TimeSlotPicker = ({ doctorId, onSelect }: TimeSlotPickerProps) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (doctorId) {
      fetchDoctorAvailability(doctorId);
    } else {
      setTimeSlots([]);
    }
  }, [doctorId]);

  const fetchDoctorAvailability = async (doctorId: string) => {
    setIsLoading(true);
    try {
      // Primero obtenemos el ID del doctor basado en el ID enviado
      const { data: doctorData, error: doctorError } = await supabase
        .from("doctors")
        .select("id")
        .eq("id", doctorId)
        .single();

      if (doctorError) throw doctorError;

      // Obtenemos la disponibilidad del doctor
      const { data: availabilityData, error: availabilityError } = await supabase
        .from("doctor_availability")
        .select("*")
        .eq("doctor_id", doctorData.id);

      if (availabilityError) throw availabilityError;

      if (!availabilityData || availabilityData.length === 0) {
        setTimeSlots([]);
        setIsLoading(false);
        return;
      }

      // Convertimos la disponibilidad semanal en slots específicos de fecha/hora
      const generatedSlots = generateTimeSlotsFromAvailability(availabilityData);
      setTimeSlots(generatedSlots);
    } catch (error) {
      console.error("Error fetching doctor availability:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la disponibilidad del médico",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateTimeSlotsFromAvailability = (availabilityData: DoctorAvailability[]): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const today = new Date();
    const startDay = startOfWeek(today, { weekStartsOn: 1 }); // Empezamos desde el lunes
    
    // Generamos slots para las próximas 2 semanas
    for (let weekOffset = 0; weekOffset < 2; weekOffset++) {
      for (const availability of availabilityData) {
        // Convertimos el día de la semana (0=domingo, 1=lunes, ...) a días desde el inicio de la semana
        let dayOffset = availability.day_of_week === 0 ? 6 : availability.day_of_week - 1;
        
        // Calculamos la fecha específica
        const slotDate = addDays(startDay, dayOffset + (weekOffset * 7));
        
        // Solo incluimos fechas futuras (hoy y después)
        if (slotDate >= today) {
          // Creamos un slot por cada hora disponible (con incrementos de 1 hora)
          let currentHour = availability.start_hour;
          let currentMinute = availability.start_minute;
          
          while (
            currentHour < availability.end_hour || 
            (currentHour === availability.end_hour && currentMinute < availability.end_minute)
          ) {
            const startTimeDate = setMinutes(setHours(slotDate, currentHour), currentMinute);
            
            // Calculamos la hora de fin (1 hora después)
            let endHour = currentHour;
            let endMinute = currentMinute + 60;
            
            if (endMinute >= 60) {
              endHour += 1;
              endMinute -= 60;
            }
            
            // Verificamos que no exceda el horario final del médico
            if (
              endHour > availability.end_hour || 
              (endHour === availability.end_hour && endMinute > availability.end_minute)
            ) {
              endHour = availability.end_hour;
              endMinute = availability.end_minute;
            }
            
            const startTimeStr = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
            const endTimeStr = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
            
            slots.push({
              id: `${availability.id}-${slotDate.toISOString()}-${startTimeStr}`,
              date: new Date(slotDate),
              startTime: startTimeStr,
              endTime: endTimeStr,
              available: true, // En un sistema real, verificaríamos si ya está reservado
            });
            
            // Avanzamos una hora
            currentMinute += 60;
            if (currentMinute >= 60) {
              currentHour += 1;
              currentMinute -= 60;
            }
          }
        }
      }
    }
    
    return slots;
  };

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
      <div className="space-y-3">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-32 w-full rounded-md" />
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
        Object.entries(slotsByDay)
          .sort(([dateA], [dateB]) => dateA.localeCompare(dateB)) // Ordenar por fecha
          .map(([dateKey, slots]) => (
            <div key={dateKey} className="border rounded-md p-4">
              <h4 className="font-medium mb-2">
                {format(new Date(dateKey), "EEEE d 'de' MMMM", { locale: es })}
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {slots
                  .filter((slot) => slot.available)
                  .sort((a, b) => a.startTime.localeCompare(b.startTime)) // Ordenar por hora
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

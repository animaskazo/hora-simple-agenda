
import { addDays, startOfWeek, setHours, setMinutes } from "date-fns";
import { TimeSlotData } from "./TimeSlot";

interface DoctorAvailability {
  id: string;
  day_of_week: number;
  start_hour: number;
  start_minute: number;
  end_hour: number;
  end_minute: number;
}

export const generateTimeSlotsFromAvailability = (availabilityData: DoctorAvailability[]): TimeSlotData[] => {
  const slots: TimeSlotData[] = [];
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

// Group slots by day
export const groupSlotsByDay = (timeSlots: TimeSlotData[]) => {
  return timeSlots.reduce((acc, slot) => {
    const dateKey = format(slot.date, "yyyy-MM-dd");
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(slot);
    return acc;
  }, {} as Record<string, TimeSlotData[]>);
};

// Helper function to format dates
import { format } from "date-fns";

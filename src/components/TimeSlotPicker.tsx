
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { TimeSlotData } from "./time-slot-picker/TimeSlot";
import { DateGroup } from "./time-slot-picker/DateGroup";
import { LoadingState } from "./time-slot-picker/LoadingState";
import { EmptyState } from "./time-slot-picker/EmptyState";
import { generateTimeSlotsFromAvailability, groupSlotsByDay } from "./time-slot-picker/timeSlotUtils";

interface TimeSlotPickerProps {
  doctorId: string;
  onSelect: (slot: TimeSlotData) => void;
}

const TimeSlotPicker = ({ doctorId, onSelect }: TimeSlotPickerProps) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlotData[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!doctorId) {
      console.log("TimeSlotPicker: No doctor ID provided, cannot fetch availability");
      setTimeSlots([]);
      setIsLoading(false);
      return;
    }
    
    console.log(`TimeSlotPicker: Fetching availability for doctor ID: "${doctorId}"`);
    fetchDoctorAvailability(doctorId);
  }, [doctorId]);

  const fetchDoctorAvailability = async (doctorId: string) => {
    setIsLoading(true);
    try {
      // Get doctor availability using public access (no authentication required)
      console.log(`Fetching doctor availability for ID: "${doctorId}"`);
      const { data: availabilityData, error: availabilityError } = await supabase
        .from("doctor_availability")
        .select("*")
        .eq("doctor_id", doctorId);

      if (availabilityError) {
        console.error("Error fetching availability:", availabilityError);
        throw availabilityError;
      }

      console.log(`Availability data response:`, availabilityData);

      if (!availabilityData || availabilityData.length === 0) {
        console.log(`No availability data found for doctor ID: "${doctorId}"`);
        setTimeSlots([]);
        setIsLoading(false);
        return;
      }

      // Generate specific date/time slots from availability
      const generatedSlots = generateTimeSlotsFromAvailability(availabilityData);
      console.log(`Generated ${generatedSlots.length} time slots from availability data`);
      setTimeSlots(generatedSlots);
    } catch (error) {
      console.error("Error fetching doctor availability:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la disponibilidad del médico",
        variant: "destructive",
      });
      // Ensure we set empty slots so the UI shows the error state
      setTimeSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSlot = (slot: TimeSlotData) => {
    setSelectedSlot(slot.id);
    onSelect(slot);
  };

  if (!doctorId) {
    return <EmptyState message="Por favor, selecciona un médico para ver su disponibilidad." />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  // Group slots by day
  const slotsByDay = groupSlotsByDay(timeSlots);
  const sortedDates = Object.keys(slotsByDay).sort();

  if (sortedDates.length === 0) {
    return <EmptyState message="No hay horarios disponibles para este médico." />;
  }

  return (
    <div className="space-y-4">
      {sortedDates.map((dateKey) => (
        <DateGroup
          key={dateKey}
          dateKey={dateKey}
          slots={slotsByDay[dateKey]}
          selectedSlotId={selectedSlot}
          onSelectSlot={handleSelectSlot}
        />
      ))}
    </div>
  );
};

export default TimeSlotPicker;

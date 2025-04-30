
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import { TimeSlotData } from "@/components/time-slot-picker/TimeSlot";

interface DoctorData {
  id: string;
  name: string;
  specialty: string;
  user_id: string;
  specialty_id: string | null;
}

interface DoctorInfoProps {
  doctor: DoctorData;
}

const DoctorInfo = ({ doctor }: DoctorInfoProps) => {
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotData | null>(null);

  const handleSelectSlot = (slot: TimeSlotData) => {
    setSelectedSlot(slot);
  };

  const handleBookAppointment = () => {
    if (selectedSlot) {
      navigate("/booking", {
        state: {
          selectedDoctorId: doctor.id,
          selectedDoctorName: doctor.name,
          selectedSpecialty: doctor.specialty,
          preselectedSlot: selectedSlot
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">{doctor.name}</h1>
        <p className="text-muted-foreground">{doctor.specialty}</p>
      </div>
      
      <div className="border-t pt-6">
        <h2 className="text-xl font-medium mb-4">Horarios Disponibles</h2>
        <TimeSlotPicker 
          doctorId={doctor.id} 
          onSelect={handleSelectSlot} 
        />
      </div>
      
      {selectedSlot && (
        <div className="border-t pt-6">
          <Button
            className="w-full"
            onClick={handleBookAppointment}
          >
            Reservar Cita
          </Button>
        </div>
      )}
    </div>
  );
};

export default DoctorInfo;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import { TimeSlotData } from "@/components/time-slot-picker/TimeSlot";
import { ExternalLink, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  
  const doctorUrl = `${window.location.origin}/doctor/${doctor.id}`;

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(doctorUrl).then(() => {
      toast({
        title: "Link copiado",
        description: "Enlace del doctor copiado al portapapeles",
      });
    }).catch(err => {
      console.error("Error al copiar el enlace:", err);
      toast({
        title: "Error",
        description: "No se pudo copiar el enlace",
        variant: "destructive",
      });
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">{doctor.name}</h1>
        <p className="text-muted-foreground mb-4">{doctor.specialty}</p>
        
        <div className="flex items-center space-x-2 mb-2 text-sm">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-2"
            onClick={handleCopyLink}
          >
            <Copy size={16} />
            Copiar enlace de perfil
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-2"
            asChild
          >
            <a href={doctorUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink size={16} />
              Abrir en nueva pestaña
            </a>
          </Button>
        </div>
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

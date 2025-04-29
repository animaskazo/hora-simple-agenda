
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SpecialtySelector from "@/components/SpecialtySelector";
import DoctorSelector from "@/components/DoctorSelector";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import PatientForm from "@/components/PatientForm";

interface TimeSlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  available: boolean;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

// Datos de ejemplo, normalmente vendrían de una API
const MOCK_DOCTORS: Doctor[] = [
  { id: "1", name: "Dra. Ana Martínez", specialty: "Medicina General" },
  { id: "2", name: "Dr. Carlos Rodriguez", specialty: "Medicina General" },
  { id: "3", name: "Dra. Laura González", specialty: "Pediatría" },
  { id: "4", name: "Dr. Juan Pérez", specialty: "Pediatría" },
  { id: "5", name: "Dra. Sofía Contreras", specialty: "Ginecología" },
  { id: "6", name: "Dr. Miguel Sánchez", specialty: "Dermatología" },
];

const PatientBooking = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const selectedDoctor = MOCK_DOCTORS.find(d => d.id === selectedDoctorId);

  const handleSpecialtySelect = (specialty: string) => {
    setSelectedSpecialty(specialty);
    setSelectedDoctorId("");
    setSelectedSlot(null);
  };

  const handleDoctorSelect = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setSelectedSlot(null);
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Reservar Hora Médica</h1>
        
        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium mb-2">1. Selecciona una especialidad</h2>
                    <SpecialtySelector onSelect={handleSpecialtySelect} />
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-medium mb-2">2. Selecciona un médico</h2>
                    <DoctorSelector 
                      specialty={selectedSpecialty} 
                      onSelect={handleDoctorSelect} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {selectedDoctorId && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-medium mb-4">
                    3. Selecciona un horario
                  </h2>
                  <TimeSlotPicker 
                    doctorId={selectedDoctorId} 
                    onSelect={handleTimeSlotSelect}
                  />
                </CardContent>
              </Card>
            )}
            
            {selectedSlot && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-lg font-medium mb-4">
                    4. Completa tus datos
                  </h2>
                  <PatientForm 
                    selectedSlot={selectedSlot}
                    doctorName={selectedDoctor?.name || ""}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PatientBooking;


import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SpecialtySelector from "@/components/SpecialtySelector";
import DoctorSelector from "@/components/DoctorSelector";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import PatientForm from "@/components/PatientForm";
import { useToast } from "@/hooks/use-toast";

interface TimeSlot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  available: boolean;
}

interface LocationState {
  selectedDoctorId?: string;
  selectedDoctorName?: string;
  selectedSpecialty?: string;
  preselectedSlot?: TimeSlot;
}

const PatientBooking = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(state?.selectedSpecialty || "");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(state?.selectedDoctorId || "");
  const [selectedDoctorName, setSelectedDoctorName] = useState<string>(state?.selectedDoctorName || "");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(state?.preselectedSlot || null);
  const [step, setStep] = useState<number>(1);
  const { toast } = useToast();

  // Determinar el paso inicial basado en los datos pre-seleccionados
  useEffect(() => {
    if (state) {
      if (state.selectedSpecialty) {
        setStep(2);  // Avanzar al paso de selección de médico
        
        if (state.selectedDoctorId) {
          setStep(3);  // Avanzar al paso de selección de horario
          
          if (state.preselectedSlot) {
            setStep(4);  // Avanzar al paso de datos del paciente
          }
        }
      }
    }
  }, [state]);

  const handleSpecialtySelect = (specialty: string) => {
    setSelectedSpecialty(specialty);
    setSelectedDoctorId("");
    setSelectedDoctorName("");
    setSelectedSlot(null);
    setStep(2);
  };

  const handleDoctorSelect = (doctorId: string, doctorName: string) => {
    setSelectedDoctorId(doctorId);
    setSelectedDoctorName(doctorName);
    setSelectedSlot(null);
    setStep(3);
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setStep(4);
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Reservar Hora Médica</h1>
        
        <div className="max-w-2xl mx-auto">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between">
              <div className="text-sm">Especialidad</div>
              <div className="text-sm">Médico</div>
              <div className="text-sm">Horario</div>
              <div className="text-sm">Datos</div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full mt-2">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              ></div>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Selecciona una especialidad</h2>
                  <SpecialtySelector 
                    onSelect={handleSpecialtySelect}
                    initialValue={selectedSpecialty}
                  />
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Selecciona un médico</h2>
                  <DoctorSelector 
                    specialty={selectedSpecialty}
                    onSelect={handleDoctorSelect}
                    initialValue={selectedDoctorId}
                  />
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={goBack}>Volver</Button>
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Selecciona un horario</h2>
                  <TimeSlotPicker
                    doctorId={selectedDoctorId}
                    onSelect={handleTimeSlotSelect}
                  />
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={goBack}>Volver</Button>
                  </div>
                </div>
              )}
              
              {step === 4 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-medium">Completa tus datos</h2>
                  <PatientForm
                    selectedSlot={selectedSlot}
                    doctorName={selectedDoctorName}
                    doctorId={selectedDoctorId}
                  />
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={goBack}>Volver</Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PatientBooking;

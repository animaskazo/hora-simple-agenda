
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SpecialtySelector from "@/components/SpecialtySelector";
import DoctorSelector from "@/components/DoctorSelector";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import PatientForm from "@/components/PatientForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

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

const STEPS = ["specialty", "doctor", "time", "patient"];

const PatientBooking = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>("");
  const [selectedDoctorName, setSelectedDoctorName] = useState<string>("");
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [activeStep, setActiveStep] = useState("specialty");
  const { toast } = useToast();

  const handleSpecialtySelect = (specialty: string) => {
    setSelectedSpecialty(specialty);
    setSelectedDoctorId("");
    setSelectedDoctorName("");
    setSelectedSlot(null);
    setActiveStep("doctor");
  };

  const handleDoctorSelect = (doctorId: string, doctorName: string) => {
    setSelectedDoctorId(doctorId);
    setSelectedDoctorName(doctorName);
    setSelectedSlot(null);
    setActiveStep("time");
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setActiveStep("patient");
  };

  const canNavigateTo = (step: string) => {
    const currentStepIndex = STEPS.indexOf(activeStep);
    const targetStepIndex = STEPS.indexOf(step);
    
    if (targetStepIndex <= currentStepIndex) return true;
    
    if (step === "doctor" && selectedSpecialty) return true;
    if (step === "time" && selectedDoctorId) return true;
    if (step === "patient" && selectedSlot) return true;
    
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Reservar Hora Médica</h1>
        
        <div className="max-w-3xl mx-auto">
          <Tabs value={activeStep} onValueChange={(value) => {
            if (canNavigateTo(value)) {
              setActiveStep(value);
            } else {
              toast({
                title: "Completa el paso actual",
                description: "Debes completar este paso antes de avanzar",
                variant: "destructive"
              });
            }
          }}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="specialty">Especialidad</TabsTrigger>
              <TabsTrigger value="doctor" disabled={!selectedSpecialty}>Médico</TabsTrigger>
              <TabsTrigger value="time" disabled={!selectedDoctorId}>Horario</TabsTrigger>
              <TabsTrigger value="patient" disabled={!selectedSlot}>Datos</TabsTrigger>
            </TabsList>
            
            <Card className="mt-6">
              <CardContent className="pt-6">
                <TabsContent value="specialty">
                  <div>
                    <h2 className="text-lg font-medium mb-2">Selecciona una especialidad</h2>
                    <SpecialtySelector 
                      onSelect={handleSpecialtySelect} 
                      initialValue={selectedSpecialty}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="doctor">
                  <div>
                    <h2 className="text-lg font-medium mb-2">Selecciona un médico</h2>
                    <DoctorSelector 
                      specialty={selectedSpecialty} 
                      onSelect={handleDoctorSelect}
                      initialValue={selectedDoctorId}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="time">
                  <div>
                    <h2 className="text-lg font-medium mb-2">Selecciona un horario</h2>
                    <TimeSlotPicker 
                      doctorId={selectedDoctorId} 
                      onSelect={handleTimeSlotSelect}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="patient">
                  <div>
                    <h2 className="text-lg font-medium mb-2">Completa tus datos</h2>
                    <PatientForm 
                      selectedSlot={selectedSlot}
                      doctorName={selectedDoctorName}
                      doctorId={selectedDoctorId}
                    />
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PatientBooking;

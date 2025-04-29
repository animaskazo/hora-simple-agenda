import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { TimeSlotData } from "@/components/time-slot-picker/TimeSlot";
import { Button } from "@/components/ui/button";

const DoctorAvailabilityView = () => {
  const { doctorId, email } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlotData | null>(null);

  useEffect(() => {
    console.log("DoctorAvailabilityView: Initializing with params:", { doctorId, email });
    
    const fetchDoctorData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let doctorData = null;

        // Check if we have an email parameter
        if (email) {
          console.log(`Looking up doctor by email: ${email}`);
          
          // First, get the doctor that matches this email through a direct join
          const { data, error } = await supabase
            .rpc('find_doctor_by_email', { email_param: email });
            
          if (error) {
            console.error("Error finding doctor by email:", error);
            throw new Error(`Error al buscar médico por email: ${error.message}`);
          }
          
          console.log("Doctor lookup by email result:", data);
          
          if (!data || data.length === 0) {
            throw new Error(`No se encontró ningún médico con el email: ${email}`);
          }
          
          doctorData = data[0];
        } 
        // Otherwise, look up by doctor ID
        else if (doctorId) {
          console.log(`Looking up doctor by ID: ${doctorId}`);
          
          const { data, error } = await supabase
            .from("doctors")
            .select("*")
            .eq("id", doctorId)
            .single();
            
          if (error) {
            console.error("Error fetching doctor by ID:", error);
            throw new Error(`Error al buscar médico por ID: ${error.message}`);
          }
          
          console.log("Doctor lookup by ID result:", data);
          
          if (!data) {
            throw new Error(`No se encontró ningún médico con el ID: ${doctorId}`);
          }
          
          doctorData = data;
        } 
        else {
          throw new Error("No se proporcionó email ni ID del médico");
        }
        
        setDoctor(doctorData);
      } catch (error: any) {
        console.error("Error fetching doctor data:", error);
        setError(error.message || "Error al cargar los datos del médico");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorData();
  }, [doctorId, email]);

  const handleSelectSlot = (slot: TimeSlotData) => {
    setSelectedSlot(slot);
  };

  const handleBookAppointment = () => {
    if (selectedSlot && doctor) {
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
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <p>Cargando información del médico...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-destructive">{error}</p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/")}
                    className="mt-4"
                  >
                    Volver a Inicio
                  </Button>
                </div>
              ) : doctor ? (
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
              ) : (
                <div className="text-center py-8">
                  <p className="text-destructive">No se encontró información del médico</p>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate("/")}
                    className="mt-4"
                  >
                    Volver a Inicio
                  </Button>
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

export default DoctorAvailabilityView;


import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const DoctorAvailabilityView = () => {
  const { doctorId, email } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [doctorName, setDoctorName] = useState<string>("");
  const [doctorSpecialty, setDoctorSpecialty] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [foundDoctorId, setFoundDoctorId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        setLoading(true);
        
        let query = supabase.from("doctors").select("id, name, specialty");
        
        // Check if we're using doctorId or email for the search
        if (doctorId) {
          query = query.eq("id", doctorId);
        } else if (email) {
          // Assuming the doctor's email is stored in the auth.users table
          // and linked to the doctors table via user_id
          const { data: userData, error: userError } = await supabase
            .from("doctors")
            .select("id, name, specialty, user_id")
            .eq("user_id", email);
            
          if (userError) {
            throw userError;
          }
          
          if (userData && userData.length > 0) {
            setDoctorName(userData[0].name);
            setDoctorSpecialty(userData[0].specialty);
            setFoundDoctorId(userData[0].id);
            setLoading(false);
            return;
          } else {
            setError(true);
            toast({
              title: "Error",
              description: "No se encontró el médico con ese correo electrónico",
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
        } else {
          setError(true);
          toast({
            title: "Error",
            description: "No se proporcionó un identificador válido para el médico",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const { data, error } = await query.maybeSingle();

        if (error) {
          console.error("Error fetching doctor:", error);
          throw error;
        }

        if (!data) {
          setError(true);
          toast({
            title: "Error",
            description: "No se encontró el médico solicitado",
            variant: "destructive",
          });
          return;
        }

        setDoctorName(data.name);
        setDoctorSpecialty(data.specialty);
        setFoundDoctorId(data.id);
      } catch (error) {
        console.error("Error:", error);
        setError(true);
        toast({
          title: "Error",
          description: "No se pudo cargar la información del médico",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [doctorId, email, toast]);

  const handleSelectSlot = (slot: any) => {
    // Redirigir al formulario de reserva con los datos del slot y doctor preseleccionados
    navigate(`/booking`, { 
      state: { 
        selectedDoctorId: foundDoctorId || doctorId,
        selectedDoctorName: doctorName,
        selectedSpecialty: doctorSpecialty,
        preselectedSlot: slot
      } 
    });
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto py-8 px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-lg font-medium text-center">Médico no encontrado</h2>
                <p className="text-center mt-4">
                  El médico solicitado no existe o no está disponible.
                </p>
                <div className="flex justify-center mt-6">
                  <Button onClick={() => navigate('/')}>
                    Volver al inicio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <Button 
          variant="ghost" 
          className="mb-4 flex items-center gap-1"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" /> Volver
        </Button>
        
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              {loading ? (
                <div className="py-8 text-center">
                  <p>Cargando información del médico...</p>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold mb-2 text-center">Dr. {doctorName}</h1>
                  <h2 className="text-lg text-gray-600 mb-6 text-center">{doctorSpecialty}</h2>
                  
                  <h3 className="font-medium mb-4">Horarios disponibles:</h3>
                  <TimeSlotPicker
                    doctorId={foundDoctorId || doctorId || ""}
                    onSelect={handleSelectSlot}
                  />
                </>
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

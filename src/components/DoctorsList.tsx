import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  has_availability: boolean;
}

const DoctorsList = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log("Fetching doctors with availability...");
        // Fetch doctors that have availability set up using our updated function
        const { data, error } = await supabase
          .rpc('get_doctors_with_availability');
          
        if (error) {
          console.error("Error fetching doctors:", error);
          throw error;
        }
        
        console.log("Doctors with availability:", data);
        setDoctors(data as Doctor[] || []);
      } catch (error: any) {
        console.error("Error fetching doctors:", error);
        
        // Fallback to fetch all doctors if the RPC fails
        try {
          const { data: allDoctors, error: doctorsError } = await supabase
            .from("doctors")
            .select("id, name, specialty")
            .order("name");
            
          if (doctorsError) throw doctorsError;
          
          // Add the has_availability property to each doctor
          const doctorsWithAvailability = allDoctors?.map(doctor => ({
            ...doctor,
            has_availability: false // Default to false since we're in fallback mode
          })) || [];
          
          setDoctors(doctorsWithAvailability);
        } catch (fallbackError) {
          setError("Error al cargar la lista de médicos");
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDoctors();
  }, []);
  
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p>Cargando médicos disponibles...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>{error}</p>
      </div>
    );
  }
  
  if (doctors.length === 0) {
    return (
      <div className="text-center py-8">
        <p>No hay médicos disponibles actualmente.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map((doctor) => (
        <Card key={doctor.id} className="overflow-hidden hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <h3 className="font-medium text-lg mb-1">{doctor.name}</h3>
            <p className="text-muted-foreground mb-4">{doctor.specialty}</p>
            <div className="flex justify-end">
              <Button asChild size="sm">
                <Link to={`/doctor/${doctor.id}`}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Ver disponibilidad
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DoctorsList;

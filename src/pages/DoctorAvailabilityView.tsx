import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingState from "@/components/doctor/LoadingState";
import ErrorState from "@/components/doctor/ErrorState";
import EmptyState from "@/components/doctor/EmptyState";
import DoctorInfo from "@/components/doctor/DoctorInfo";
import { fetchDoctorByEmail, fetchDoctorById } from "@/services/DoctorService";

interface DoctorData {
  id: string;
  name: string;
  specialty: string;
  user_id: string;
  specialty_id: string | null;
}

const DoctorAvailabilityView = () => {
  const { doctorId, email } = useParams<{ doctorId?: string; email?: string }>();
  const [doctor, setDoctor] = useState<DoctorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("DoctorAvailabilityView: Initializing with params:", { doctorId, email });
    
    const fetchDoctorData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let doctorData = null;

        // Check if we have an email parameter
        if (email) {
          console.log(`Fetching doctor by email: ${email}`);
          doctorData = await fetchDoctorByEmail(email);
        } 
        // Otherwise, look up by doctor ID
        else if (doctorId) {
          console.log(`Fetching doctor by ID: ${doctorId}`);
          doctorData = await fetchDoctorById(doctorId);
        } 
        else {
          throw new Error("No se proporcionó email ni ID del médico");
        }
        
        console.log("Doctor data fetched successfully:", doctorData);
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

  // Render content based on state
  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }
    
    if (error) {
      return <ErrorState errorMessage={error} />;
    }
    
    if (!doctor) {
      return <EmptyState />;
    }
    
    return <DoctorInfo doctor={doctor} />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              {renderContent()}
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DoctorAvailabilityView;

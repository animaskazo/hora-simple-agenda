
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface DoctorData {
  id: string;
  name: string;
  specialty: string;
  user_id: string;
  specialty_id: string | null;
  has_availability?: boolean;
}

export const fetchDoctorByEmail = async (email: string): Promise<DoctorData> => {
  console.log(`Looking up doctor by email: ${email}`);
  
  const { data, error } = await supabase
    .rpc('find_doctor_by_email', { email_param: email });
    
  if (error) {
    console.error("Error finding doctor by email:", error);
    throw new Error(`Error al buscar médico por email: ${error.message}`);
  }
  
  console.log("Doctor lookup by email result:", data);
  
  if (!data || (Array.isArray(data) && data.length === 0)) {
    throw new Error(`No se encontró ningún médico con el email: ${email}`);
  }
  
  // Check if data is an array and contains results
  if (Array.isArray(data)) {
    return data[0]; // Take the first doctor if there are multiple
  }
  
  return data;
};

export const fetchDoctorById = async (doctorId: string): Promise<DoctorData> => {
  console.log(`Looking up doctor by ID: ${doctorId}`);
  
  try {
    // First try using the rpc function that returns doctors with availability
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('get_doctors_with_availability');
      
    if (rpcError) {
      console.error("Error fetching doctors with availability:", rpcError);
    } else {
      console.log("RPC data returned:", rpcData);
      
      if (rpcData && rpcData.length > 0) {
        const doctor = rpcData.find((d: any) => d.id === doctorId);
        
        if (doctor) {
          console.log("Found doctor in RPC data:", doctor);
          // Add the missing properties required by DoctorData interface
          return {
            ...doctor,
            user_id: doctor.user_id || "", 
            specialty_id: doctor.specialty_id || null
          };
        }
      }
    }
    
    // If not found in RPC, try direct table access
    console.log("Doctor not found in RPC, trying direct table access");
    const { data, error } = await supabase
      .from("doctors")
      .select("*")
      .eq("id", doctorId)
      .single();
      
    if (error) {
      console.error("Error fetching doctor by direct query:", error);
      throw error;
    }
    
    console.log("Doctor lookup by direct query result:", data);
    
    if (!data) {
      throw new Error(`No se encontró ningún médico con el ID: ${doctorId}`);
    }
    
    return data;
  } catch (error: any) {
    console.error("Error in fetchDoctorById:", error);
    throw new Error(`Error al buscar médico por ID: ${error.message || 'Unknown error'}`);
  }
};

export const showDoctorFoundToast = (doctorName: string) => {
  toast({
    title: "Médico encontrado",
    description: `Se ha encontrado el médico: ${doctorName}`,
  });
};

export const showErrorToast = (errorMessage: string) => {
  toast({
    title: "Error",
    description: errorMessage,
    variant: "destructive",
  });
};

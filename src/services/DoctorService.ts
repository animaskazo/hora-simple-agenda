
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface DoctorData {
  id: string;
  name: string;
  specialty: string;
  user_id: string;
  specialty_id: string | null;
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
  
  const { data, error } = await supabase
    .from("doctors")
    .select("*")
    .eq("id", doctorId)
    .maybeSingle();
    
  if (error) {
    console.error("Error fetching doctor by ID:", error);
    throw new Error(`Error al buscar médico por ID: ${error.message}`);
  }
  
  console.log("Doctor lookup by ID result:", data);
  
  if (!data) {
    throw new Error(`No se encontró ningún médico con el ID: ${doctorId}`);
  }
  
  return data;
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

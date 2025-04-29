
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface DoctorSelectorProps {
  specialty: string;
  onSelect: (doctorId: string, doctorName: string) => void;
  initialValue?: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  specialty_id?: string; // Adding this optional property to fix the TypeScript error
}

const DoctorSelector = ({ specialty, onSelect, initialValue }: DoctorSelectorProps) => {
  const [selectedDoctor, setSelectedDoctor] = useState<string>(initialValue || "");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (specialty) {
      fetchDoctors(specialty);
    } else {
      setDoctors([]);
    }
  }, [specialty]);

  const fetchDoctors = async (specialty: string) => {
    setIsLoading(true);
    try {
      console.log("Buscando médicos para la especialidad:", specialty);
      
      // First get all doctors and then filter
      const { data, error } = await supabase
        .from("doctors")
        .select("id, name, specialty, specialty_id");

      if (error) {
        console.error("Error fetching doctors:", error);
        throw error;
      }

      console.log("Todos los médicos obtenidos:", data);
      
      // Find specialty ID if needed for filtering
      const { data: specialtyData } = await supabase
        .from("specialties")
        .select("id")
        .eq("name", specialty)
        .maybeSingle();
        
      console.log("Especialidad encontrada:", specialtyData);
      
      // Filter doctors by specialty name or specialty_id
      let matchingDoctors: Doctor[] = [];
      if (data) {
        matchingDoctors = data.filter(doctor => 
          doctor.specialty === specialty || 
          (specialtyData?.id && doctor.specialty_id === specialtyData.id)
        );
      }
      
      console.log(`Encontrados ${matchingDoctors.length} médicos para la especialidad ${specialty}`);
      console.log("Médicos encontrados:", matchingDoctors);
      
      setDoctors(matchingDoctors);
      
      // Reset selectedDoctor if it's no longer valid
      if (selectedDoctor && !matchingDoctors.some(d => d.id === selectedDoctor)) {
        console.log("Reseteando el médico seleccionado porque ya no existe en los resultados");
        setSelectedDoctor("");
      }
    } catch (error) {
      console.error("Error al buscar médicos:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los médicos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (value: string) => {
    setSelectedDoctor(value);
    const doctor = doctors.find(d => d.id === value);
    if (doctor) {
      onSelect(value, doctor.name);
    }
  };

  return (
    <div className="w-full">
      <Select
        onValueChange={handleSelect}
        value={selectedDoctor}
        disabled={!specialty || isLoading}
      >
        <SelectTrigger>
          <SelectValue
            placeholder={
              !specialty
                ? "Primero selecciona una especialidad"
                : isLoading
                ? "Cargando médicos..."
                : doctors.length === 0
                ? "No hay médicos disponibles"
                : "Seleccionar médico"
            }
          />
        </SelectTrigger>
        <SelectContent>
          {doctors.map((doctor) => (
            <SelectItem key={doctor.id} value={doctor.id}>
              {doctor.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DoctorSelector;

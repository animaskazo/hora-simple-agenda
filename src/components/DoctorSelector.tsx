
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
      
      // Primer intento: buscar por el ID de la especialidad en la tabla specialties
      const { data: specialtyData, error: specialtyError } = await supabase
        .from("specialties")
        .select("id")
        .eq("name", specialty)
        .maybeSingle();

      let doctorsFound: Doctor[] = [];

      if (specialtyData?.id) {
        console.log("Especialidad encontrada con ID:", specialtyData.id);
        // Buscar doctores por el ID de la especialidad
        const { data, error } = await supabase
          .from("doctors")
          .select("id, name, specialty")
          .eq("specialty_id", specialtyData.id);

        if (error) {
          console.error("Error buscando por specialty_id:", error);
        } else if (data && data.length > 0) {
          console.log(`Encontrados ${data.length} médicos por specialty_id`);
          doctorsFound = data;
        }
      }

      // Si no se encontraron doctores por specialty_id o hubo un error, buscar por el nombre de la especialidad
      if (doctorsFound.length === 0) {
        console.log("Buscando médicos por nombre de especialidad:", specialty);
        const { data, error } = await supabase
          .from("doctors")
          .select("id, name, specialty")
          .eq("specialty", specialty);

        if (error) {
          console.error("Error buscando por specialty:", error);
          throw error;
        } else if (data && data.length > 0) {
          console.log(`Encontrados ${data.length} médicos por specialty`);
          doctorsFound = data;
        }
      }

      // Combinar resultados (eliminando duplicados)
      const uniqueDoctors = Array.from(new Map(doctorsFound.map(doctor => 
        [doctor.id, doctor])).values());
      
      console.log(`Total de médicos encontrados (únicos): ${uniqueDoctors.length}`);
      setDoctors(uniqueDoctors);
      
      // Reset selectedDoctor if it's no longer valid
      if (selectedDoctor && !uniqueDoctors.some(d => d.id === selectedDoctor)) {
        console.log("Reseteando el médico seleccionado porque ya no existe en los resultados");
        setSelectedDoctor("");
      }
    } catch (error) {
      console.error("Error completo al buscar médicos:", error);
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
        disabled={!specialty || doctors.length === 0 || isLoading}
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

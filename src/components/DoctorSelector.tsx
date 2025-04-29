
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
      // Consulta actualizada para buscar por specialty_id o specialty para mayor compatibilidad
      const { data: specialtyData, error: specialtyError } = await supabase
        .from("specialties")
        .select("id")
        .eq("name", specialty)
        .single();

      if (specialtyError) {
        // Si no encontramos por ID, intentamos buscar directamente por nombre de especialidad (para compatibilidad)
        const { data, error } = await supabase
          .from("doctors")
          .select("id, name, specialty")
          .eq("specialty", specialty);

        if (error) throw error;
        setDoctors(data || []);
        
        if (selectedDoctor && !data?.some(d => d.id === selectedDoctor)) {
          setSelectedDoctor("");
        }
      } else {
        // Si encontramos la especialidad por su ID, usamos el specialty_id para la búsqueda
        const { data, error } = await supabase
          .from("doctors")
          .select("id, name, specialty")
          .eq("specialty_id", specialtyData.id);

        if (error) throw error;
        setDoctors(data || []);
        
        if (selectedDoctor && !data?.some(d => d.id === selectedDoctor)) {
          setSelectedDoctor("");
        }
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
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

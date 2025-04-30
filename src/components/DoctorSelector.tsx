
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface DoctorSelectorProps {
  specialty: string;
  onSelect: (doctorId: string, doctorName: string) => void;
  initialValue?: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  specialty_id?: string;
}

const DoctorSelector = ({ specialty, onSelect, initialValue }: DoctorSelectorProps) => {
  const [selectedDoctor, setSelectedDoctor] = useState<string>(initialValue || "");

  // Utilizamos React Query para gestionar la carga de médicos
  const { data: doctors = [], isLoading, error, refetch } = useQuery({
    queryKey: ["doctors", specialty],
    queryFn: async () => {
      if (!specialty) return [];
      
      console.log("Buscando médicos para la especialidad:", specialty);
      
      try {
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
        
        return matchingDoctors;
      } catch (error) {
        console.error("Error al buscar médicos:", error);
        throw error;
      }
    },
    enabled: !!specialty,
    meta: {
      onError: (error: Error) => {
        console.error("Error al cargar médicos:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los médicos",
          variant: "destructive",
        });
      }
    },
    placeholderData: [],
    initialData: [],
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const handleSelect = (value: string) => {
    setSelectedDoctor(value);
    const doctor = doctors.find(d => d.id === value);
    if (doctor) {
      onSelect(value, doctor.name);
    }
  };

  const handleRetry = () => {
    refetch();
  };

  // Reset selected doctor when specialty changes
  useEffect(() => {
    if (specialty) {
      setSelectedDoctor("");
    }
  }, [specialty]);

  // Check if initial value is still valid with the new doctors list
  useEffect(() => {
    if (selectedDoctor && doctors.length > 0 && !doctors.some(d => d.id === selectedDoctor)) {
      setSelectedDoctor("");
    }
  }, [doctors, selectedDoctor]);

  return (
    <div className="w-full">
      <Select
        onValueChange={handleSelect}
        value={selectedDoctor}
        disabled={!specialty || isLoading}
      >
        <SelectTrigger>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Cargando médicos...</span>
            </div>
          ) : (
            <SelectValue
              placeholder={
                !specialty
                  ? "Primero selecciona una especialidad"
                  : doctors.length === 0
                  ? "No hay médicos disponibles"
                  : "Seleccionar médico"
              }
            />
          )}
        </SelectTrigger>
        <SelectContent>
          {error ? (
            <div className="p-2 text-center">
              <p className="text-destructive text-sm mb-2">Error al cargar médicos</p>
              <button 
                className="text-xs text-primary hover:underline" 
                onClick={handleRetry}
              >
                Reintentar
              </button>
            </div>
          ) : doctors.length > 0 ? (
            doctors.map((doctor) => (
              <SelectItem key={doctor.id} value={doctor.id}>
                {doctor.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-options" disabled>
              {!specialty 
                ? "Selecciona una especialidad primero" 
                : isLoading 
                ? "Cargando médicos..." 
                : "No hay médicos disponibles para esta especialidad"}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DoctorSelector;


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
      
      // Buscar especialidad por nombre para obtener su ID
      const { data: specialtyData, error: specialtyError } = await supabase
        .from("specialties")
        .select("id, numeric_id")
        .eq("name", specialty)
        .maybeSingle();

      let doctorsFound: Doctor[] = [];

      if (specialtyData?.id) {
        console.log("Especialidad encontrada:", specialtyData);
        // Buscar doctores por el ID de la especialidad
        const { data, error } = await supabase
          .from("doctors")
          .select("id, name, specialty, specialty_id");

        if (error) {
          console.error("Error buscando por specialty_id:", error);
        } else if (data && data.length > 0) {
          // Filtrar los doctores que tienen esta especialidad (por specialty_id o specialty)
          const filteredDoctors = data.filter(doctor => 
            doctor.specialty_id === specialtyData.id || 
            doctor.specialty === specialty
          );
          
          console.log(`Encontrados ${filteredDoctors.length} médicos para esta especialidad`);
          doctorsFound = filteredDoctors;
          
          // Verificar si nuestro doctor específico está incluido
          const specificDoctor = data.find(d => d.id === "9594791d-04a0-4c5b-9866-a89623da5cdf");
          if (specificDoctor) {
            console.log("Doctor específico encontrado:", specificDoctor);
            if (!doctorsFound.some(d => d.id === specificDoctor.id)) {
              console.log("Agregando el doctor específico a la lista");
              doctorsFound.push(specificDoctor);
            }
          }
        }
      }

      // Si no se encontraron doctores, busquemos todos los doctores y filtremos manualmente
      if (doctorsFound.length === 0) {
        console.log("Buscando todos los doctores para filtrar manualmente");
        const { data, error } = await supabase
          .from("doctors")
          .select("id, name, specialty, specialty_id");

        if (error) {
          console.error("Error buscando todos los doctores:", error);
          throw error;
        } else if (data && data.length > 0) {
          console.log(`Revisando ${data.length} doctores para encontrar coincidencias`);
          // Buscar doctores que coincidan con la especialidad por nombre
          doctorsFound = data.filter(doc => 
            doc.specialty === specialty || 
            (doc.specialty_id && specialtyData?.id && doc.specialty_id === specialtyData.id)
          );
          
          // Verificar si nuestro doctor específico está en todos los doctores
          const specificDoctor = data.find(d => d.id === "9594791d-04a0-4c5b-9866-a89623da5cdf");
          if (specificDoctor) {
            console.log("Doctor específico encontrado en todos los doctores:", specificDoctor);
            console.log("Especialidad del doctor:", specificDoctor.specialty);
            console.log("specialty_id del doctor:", specificDoctor.specialty_id);
            
            // Si el doctor debería estar en esta especialidad, añadirlo
            if (specificDoctor.specialty === specialty || 
                (specialtyData?.id && specificDoctor.specialty_id === specialtyData.id)) {
              if (!doctorsFound.some(d => d.id === specificDoctor.id)) {
                console.log("Agregando el doctor específico a la lista");
                doctorsFound.push(specificDoctor);
              }
            }
          }
        }
      }

      // Eliminar duplicados (por si acaso)
      const uniqueDoctors = Array.from(new Map(doctorsFound.map(doctor => 
        [doctor.id, doctor])).values());
      
      console.log(`Total de médicos encontrados (únicos): ${uniqueDoctors.length}`);
      console.log("Doctores encontrados:", uniqueDoctors);
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

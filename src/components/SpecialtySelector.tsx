
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

interface SpecialtySelectorProps {
  onSelect: (specialty: string) => void;
  initialValue?: string;
}

interface Specialty {
  name: string;
  numeric_id: number;
}

const SpecialtySelector = ({ onSelect, initialValue }: SpecialtySelectorProps) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(initialValue || "");
  
  // Utiliza React Query para manejar el estado de carga y caché de las especialidades
  const { data: specialties = [], isLoading, error, refetch } = useQuery({
    queryKey: ["specialties"],
    queryFn: async () => {
      console.log("Fetching specialties from database...");
      try {
        // Obtenemos especialidades ordenadas por numeric_id para mostrarlas en orden lógico
        const { data, error } = await supabase
          .from("specialties")
          .select("name, numeric_id")
          .order("numeric_id");

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        if (!data || data.length === 0) {
          console.log("No specialties found in database");
          return [];
        }

        console.log("Specialties fetched:", data);
        
        // Extraemos los nombres de las especialidades
        const specialtyNames = data.map(item => item.name);
        console.log("Specialty names:", specialtyNames);
        
        return specialtyNames;
      } catch (error) {
        console.error("Error loading specialties:", error);
        throw error;
      }
    },
    // En caso de error, muestra un toast y devuelve un fallback
    meta: {
      onError: (error: Error) => {
        console.error("Error loading specialties:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las especialidades",
          variant: "destructive",
        });
      }
    },
    // Si falla, retornamos un array vacío
    placeholderData: [],
    // Valores por defecto si no hay datos o hay error
    initialData: [],
    // Configuraciones para no refrescar automáticamente y hacer retry
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
  
  // Utiliza los valores por defecto si no hay especialidades
  const fallbackSpecialties = [
    "Medicina General",
    "Pediatría",
    "Ginecología",
    "Dermatología",
  ];
  
  // Si no hay especialidades en la base de datos, usa las predefinidas
  const displayedSpecialties = specialties.length > 0 ? specialties : fallbackSpecialties;

  const handleSelect = (value: string) => {
    setSelectedSpecialty(value);
    onSelect(value);
  };

  // Si había un valor inicial pero ya no es válido con las nuevas especialidades
  useEffect(() => {
    if (selectedSpecialty && !displayedSpecialties.includes(selectedSpecialty)) {
      setSelectedSpecialty("");
    }
  }, [displayedSpecialties, selectedSpecialty]);

  const handleRetry = () => {
    refetch();
  };

  return (
    <div className="w-full">
      <Select onValueChange={handleSelect} value={selectedSpecialty} disabled={isLoading}>
        <SelectTrigger className="bg-white">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Cargando especialidades...</span>
            </div>
          ) : (
            <SelectValue 
              placeholder="Seleccionar especialidad" 
            />
          )}
        </SelectTrigger>
        <SelectContent className="bg-white">
          {error ? (
            <div className="p-2 text-center">
              <p className="text-destructive text-sm mb-2">Error al cargar especialidades</p>
              <button 
                className="text-xs text-primary hover:underline" 
                onClick={handleRetry}
              >
                Reintentar
              </button>
            </div>
          ) : displayedSpecialties.length > 0 ? (
            displayedSpecialties.map((specialty) => (
              <SelectItem key={specialty} value={specialty}>
                {specialty}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-options" disabled>
              {isLoading ? "Cargando..." : "No hay especialidades disponibles"}
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SpecialtySelector;

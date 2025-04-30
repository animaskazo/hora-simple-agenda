
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
        // Obtenemos especialidades sin requerir autenticación
        const { data, error } = await supabase
          .from("specialties")
          .select("name, numeric_id")
          .order("numeric_id");

        if (error) {
          console.error("Supabase error:", error);
          throw error;
        }

        if (!data || data.length === 0) {
          console.log("No specialties found in database, using fallback values");
          return [
            "Medicina General",
            "Pediatría",
            "Ginecología",
            "Dermatología",
          ];
        }

        console.log("Specialties fetched:", data);
        
        // Extraemos los nombres de las especialidades
        const specialtyNames = data.map(item => item.name);
        console.log("Specialty names:", specialtyNames);
        
        return specialtyNames;
      } catch (error) {
        console.error("Error loading specialties:", error);
        console.log("Using fallback specialties due to error");
        return [
          "Medicina General",
          "Pediatría",
          "Ginecología",
          "Dermatología",
        ];
      }
    },
    // Valores por defecto si hay error
    placeholderData: [
      "Medicina General",
      "Pediatría",
      "Ginecología",
      "Dermatología",
    ],
    // Configuraciones para no refrescar automáticamente y hacer retry
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const handleSelect = (value: string) => {
    console.log("Selected specialty:", value);
    setSelectedSpecialty(value);
    onSelect(value);
  };

  // Si había un valor inicial pero ya no es válido con las nuevas especialidades
  useEffect(() => {
    if (selectedSpecialty && !specialties.includes(selectedSpecialty)) {
      setSelectedSpecialty("");
    }
  }, [specialties, selectedSpecialty]);

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
          ) : specialties.length > 0 ? (
            specialties.map((specialty) => (
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

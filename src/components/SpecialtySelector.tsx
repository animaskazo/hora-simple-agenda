
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

interface SpecialtySelectorProps {
  onSelect: (specialty: string) => void;
  initialValue?: string;
}

const SpecialtySelector = ({ onSelect, initialValue }: SpecialtySelectorProps) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(initialValue || "");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching specialties from database...");
      // Obtenemos las especialidades únicas de los doctores
      const { data, error } = await supabase
        .from("doctors")
        .select("specialty");

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      if (!data || data.length === 0) {
        console.log("No specialties found in database");
        throw new Error("No se encontraron especialidades");
      }

      console.log("Specialties fetched:", data);

      // Extraemos las especialidades únicas
      const uniqueSpecialties = [...new Set(data.map(item => item.specialty))];
      console.log("Unique specialties:", uniqueSpecialties);
      
      setSpecialties(uniqueSpecialties.sort());
    } catch (error) {
      console.error("Error fetching specialties:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las especialidades",
        variant: "destructive",
      });
      // Fallback a especialidades predefinidas en caso de error
      setSpecialties([
        "Medicina General",
        "Pediatría",
        "Ginecología",
        "Dermatología",
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (value: string) => {
    setSelectedSpecialty(value);
    onSelect(value);
  };

  return (
    <div className="w-full">
      <Select onValueChange={handleSelect} value={selectedSpecialty} disabled={isLoading}>
        <SelectTrigger className="bg-white">
          <SelectValue 
            placeholder={isLoading ? "Cargando especialidades..." : "Seleccionar especialidad"} 
          />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {specialties.length > 0 ? (
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

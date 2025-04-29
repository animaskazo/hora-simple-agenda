
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
      // Obtenemos las especialidades únicas de los doctores
      const { data, error } = await supabase
        .from("doctors")
        .select("specialty")
        .order("specialty");

      if (error) throw error;

      // Extraemos las especialidades únicas
      const uniqueSpecialties = [...new Set(data.map(item => item.specialty))];
      setSpecialties(uniqueSpecialties);
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
        <SelectTrigger>
          <SelectValue 
            placeholder={isLoading ? "Cargando especialidades..." : "Seleccionar especialidad"} 
          />
        </SelectTrigger>
        <SelectContent>
          {specialties.map((specialty) => (
            <SelectItem key={specialty} value={specialty}>
              {specialty}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SpecialtySelector;


import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SpecialtySelectorProps {
  onSelect: (specialty: string) => void;
}

// Esta es una lista ejemplo, podría venir de una API
const SPECIALTIES = [
  "Medicina General",
  "Pediatría",
  "Ginecología",
  "Dermatología",
  "Cardiología",
  "Oftalmología",
  "Odontología",
  "Psiquiatría",
  "Psicología",
  "Nutrición",
];

const SpecialtySelector = ({ onSelect }: SpecialtySelectorProps) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");

  const handleSelect = (value: string) => {
    setSelectedSpecialty(value);
    onSelect(value);
  };

  return (
    <div className="w-full">
      <Select onValueChange={handleSelect} value={selectedSpecialty}>
        <SelectTrigger>
          <SelectValue placeholder="Seleccionar especialidad" />
        </SelectTrigger>
        <SelectContent>
          {SPECIALTIES.map((specialty) => (
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

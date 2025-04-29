
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DoctorSelectorProps {
  specialty: string;
  onSelect: (doctorId: string) => void;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
}

// Datos de ejemplo, normalmente vendrían de una API
const MOCK_DOCTORS: Doctor[] = [
  { id: "1", name: "Dra. Ana Martínez", specialty: "Medicina General" },
  { id: "2", name: "Dr. Carlos Rodriguez", specialty: "Medicina General" },
  { id: "3", name: "Dra. Laura González", specialty: "Pediatría" },
  { id: "4", name: "Dr. Juan Pérez", specialty: "Pediatría" },
  { id: "5", name: "Dra. Sofía Contreras", specialty: "Ginecología" },
  { id: "6", name: "Dr. Miguel Sánchez", specialty: "Dermatología" },
];

const DoctorSelector = ({ specialty, onSelect }: DoctorSelectorProps) => {
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);

  useEffect(() => {
    if (specialty) {
      const doctors = MOCK_DOCTORS.filter(
        (doctor) => doctor.specialty === specialty
      );
      setFilteredDoctors(doctors);
      setSelectedDoctor(""); // Reset selected doctor when specialty changes
    } else {
      setFilteredDoctors([]);
    }
  }, [specialty]);

  const handleSelect = (value: string) => {
    setSelectedDoctor(value);
    onSelect(value);
  };

  return (
    <div className="w-full">
      <Select
        onValueChange={handleSelect}
        value={selectedDoctor}
        disabled={!specialty || filteredDoctors.length === 0}
      >
        <SelectTrigger>
          <SelectValue
            placeholder={
              !specialty
                ? "Primero selecciona una especialidad"
                : filteredDoctors.length === 0
                ? "No hay médicos disponibles"
                : "Seleccionar médico"
            }
          />
        </SelectTrigger>
        <SelectContent>
          {filteredDoctors.map((doctor) => (
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

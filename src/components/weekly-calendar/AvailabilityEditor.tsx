
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface AvailabilityEditorProps {
  selectedDay: number;
  onSave: (startHour: string, endHour: string) => void;
  onCancel: () => void;
}

export const AvailabilityEditor = ({ selectedDay, onSave, onCancel }: AvailabilityEditorProps) => {
  const [startHour, setStartHour] = useState<string>("09:00");
  const [endHour, setEndHour] = useState<string>("18:00");

  // Hours for selector
  const hours = Array.from({ length: 24 }, (_, i) => 
    `${i.toString().padStart(2, '0')}:00`
  );
  
  const handleSave = () => {
    onSave(startHour, endHour);
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Hora inicio</label>
          <select 
            value={startHour}
            onChange={e => setStartHour(e.target.value)}
            className="w-full p-2 border rounded-md mt-1"
          >
            {hours.map(hour => (
              <option key={`start-${hour}`} value={hour}>{hour}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Hora fin</label>
          <select 
            value={endHour}
            onChange={e => setEndHour(e.target.value)}
            className="w-full p-2 border rounded-md mt-1"
          >
            {hours.map(hour => (
              <option key={`end-${hour}`} value={hour}>{hour}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSave}>
          Guardar
        </Button>
      </div>
    </div>
  );
};

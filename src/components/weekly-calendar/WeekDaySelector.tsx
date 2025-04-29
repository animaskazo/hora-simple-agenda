
import { Button } from "@/components/ui/button";

interface WeekDaySelectorProps {
  selectedDay: number;
  onSelectDay: (day: number) => void;
}

const weekDays = [
  { number: 1, name: "lunes", shortName: "lun" },
  { number: 2, name: "martes", shortName: "mar" },
  { number: 3, name: "miércoles", shortName: "mié" },
  { number: 4, name: "jueves", shortName: "jue" },
  { number: 5, name: "viernes", shortName: "vie" },
  { number: 6, name: "sábado", shortName: "sáb" },
  { number: 0, name: "domingo", shortName: "dom" },
];

export const WeekDaySelector = ({ selectedDay, onSelectDay }: WeekDaySelectorProps) => {
  return (
    <div className="grid grid-cols-7 gap-2 mb-6">
      {weekDays.map(day => (
        <Button
          key={day.number}
          variant={selectedDay === day.number ? "default" : "outline"}
          className="w-full capitalize"
          onClick={() => onSelectDay(day.number)}
        >
          {day.shortName}
        </Button>
      ))}
    </div>
  );
};

export { weekDays };

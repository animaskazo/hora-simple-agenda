
export interface Availability {
  id: string;
  dayOfWeek: number; // 0 = domingo, 1 = lunes, etc.
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export interface WeeklyCalendarProps {
  onAvailabilityChange: (availability: Availability[]) => void;
  initialAvailability?: Availability[];
}

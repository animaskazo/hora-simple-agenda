
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";

interface Availability {
  id: string;
  dayOfWeek: number;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

interface Appointment {
  id: string;
  patientName: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: "confirmed" | "cancelled" | "completed";
}

// Datos de ejemplo
const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "Ana García",
    date: addDays(new Date(), 1),
    startTime: "09:00",
    endTime: "10:00",
    status: "confirmed",
  },
  {
    id: "2",
    patientName: "Carlos López",
    date: addDays(new Date(), 2),
    startTime: "11:30",
    endTime: "12:30",
    status: "confirmed",
  },
  {
    id: "3",
    patientName: "María Rodríguez",
    date: addDays(new Date(), 3),
    startTime: "15:00",
    endTime: "16:00",
    status: "confirmed",
  },
];

const DoctorDashboard = () => {
  const { toast } = useToast();
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [appointments] = useState<Appointment[]>(mockAppointments);

  const handleAvailabilityChange = (newAvailability: Availability[]) => {
    setAvailability(newAvailability);
    // En una aplicación real, aquí guardaríamos en el backend
    toast({
      title: "Disponibilidad actualizada",
      description: "Tus cambios han sido guardados correctamente",
    });
  };

  const upcomingAppointments = appointments.filter(
    (appointment) => 
      appointment.status === "confirmed" && 
      new Date(`${format(appointment.date, "yyyy-MM-dd")}T${appointment.startTime}`) > new Date()
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header isDoctor={true} />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Panel de Doctor</h1>
        
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
              <p className="text-muted-foreground">Citas pendientes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {availability.length}
              </div>
              <p className="text-muted-foreground">Bloques configurados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">12</div>
              <p className="text-muted-foreground">Horas disponibles esta semana</p>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="availability" className="mt-6">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="availability">Disponibilidad</TabsTrigger>
            <TabsTrigger value="appointments">Citas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="availability">
            <Card>
              <CardHeader>
                <CardTitle>Configurar disponibilidad</CardTitle>
              </CardHeader>
              <CardContent>
                <WeeklyCalendar onAvailabilityChange={handleAvailabilityChange} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle>Citas próximas</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.map((appointment) => (
                      <div 
                        key={appointment.id}
                        className="p-4 border rounded-md flex justify-between items-center"
                      >
                        <div>
                          <h3 className="font-medium">{appointment.patientName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {format(appointment.date, "EEEE d 'de' MMMM", { locale: es })} - {appointment.startTime} a {appointment.endTime}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-primary"></span>
                          <span className="text-sm text-muted-foreground">Confirmada</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No tienes citas programadas
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default DoctorDashboard;

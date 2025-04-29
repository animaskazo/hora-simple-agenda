
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Clock } from "lucide-react";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface DoctorData {
  id: string;
  name: string;
  specialty: string;
  created_at: string;
}

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
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  patient_rut: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  created_at: string;
}

const DoctorDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctorData, setDoctorData] = useState<DoctorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        navigate("/doctor/login");
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from("doctors")
          .select("*")
          .eq("user_id", user.id)
          .single();
        
        if (error) throw error;
        
        setDoctorData(data);

        // Fetch doctor's availability slots
        if (data && data.id) {
          const { data: availabilityData, error: availabilityError } = await supabase
            .from("doctor_availability")
            .select("*")
            .eq("doctor_id", data.id);
          
          if (availabilityError) throw availabilityError;
          
          const formattedAvailability: Availability[] = availabilityData.map(slot => ({
            id: slot.id,
            dayOfWeek: slot.day_of_week,
            startHour: slot.start_hour,
            startMinute: slot.start_minute,
            endHour: slot.end_hour,
            endMinute: slot.end_minute
          }));
          
          setAvailabilities(formattedAvailability);
          
          // Fetch doctor's appointments
          const { data: appointmentsData, error: appointmentsError } = await supabase
            .from("appointments")
            .select("*")
            .eq("doctor_id", data.id)
            .order("appointment_date", { ascending: true });
          
          if (appointmentsError) throw appointmentsError;
          
          setAppointments(appointmentsData);
        }
      } catch (error) {
        console.error("Error fetching doctor data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [user, navigate]);

  const handleAvailabilityChange = async (newAvailability: Availability[]) => {
    if (!doctorData) return;
    
    try {
      // Find which slots are new, which are deleted
      const currentIds = availabilities.map(a => a.id);
      const newIds = newAvailability.map(a => a.id);
      
      const toDelete = availabilities.filter(a => !newIds.includes(a.id));
      const toAdd = newAvailability.filter(a => !currentIds.includes(a.id));
      
      // Delete removed slots
      if (toDelete.length > 0) {
        const ids = toDelete.map(a => a.id);
        const { error: deleteError } = await supabase
          .from("doctor_availability")
          .delete()
          .in("id", ids);
        
        if (deleteError) throw deleteError;
      }
      
      // Add new slots
      if (toAdd.length > 0) {
        const newSlots = toAdd.map(slot => ({
          doctor_id: doctorData.id,
          day_of_week: slot.dayOfWeek,
          start_hour: slot.startHour,
          start_minute: slot.startMinute,
          end_hour: slot.endHour,
          end_minute: slot.endMinute
        }));
        
        const { error: insertError } = await supabase
          .from("doctor_availability")
          .insert(newSlots);
        
        if (insertError) throw insertError;
      }
      
      // Update state with new availability
      setAvailabilities(newAvailability);
      
      toast({
        title: "Disponibilidad actualizada",
        description: "Tu horario ha sido actualizado correctamente",
      });
    } catch (error) {
      console.error("Error saving availability:", error);
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar tu disponibilidad",
        variant: "destructive",
      });
    }
  };

  // Formato para visualización de fecha en español
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateStr;
    }
  };

  // Función para calcular las próximas citas (hoy y futuras)
  const getUpcomingAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return appointments
      .filter(apt => {
        const aptDate = new Date(apt.appointment_date);
        aptDate.setHours(0, 0, 0, 0);
        return aptDate >= today && apt.status === 'confirmed';
      })
      .sort((a, b) => {
        // Ordenar primero por fecha
        const dateA = new Date(a.appointment_date);
        const dateB = new Date(b.appointment_date);
        
        if (dateA.getTime() !== dateB.getTime()) {
          return dateA.getTime() - dateB.getTime();
        }
        
        // Si es el mismo día, ordenar por hora de inicio
        const [hourA, minuteA] = a.start_time.split(':').map(Number);
        const [hourB, minuteB] = b.start_time.split(':').map(Number);
        
        return (hourA * 60 + minuteA) - (hourB * 60 + minuteB);
      })
      .slice(0, 5); // Mostrar solo las 5 próximas citas
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto py-8 px-4 flex items-center justify-center">
          <p>Cargando información...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const upcomingAppointments = getUpcomingAppointments();

  return (
    <div className="min-h-screen flex flex-col">
      <Header isDoctor={true} />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Panel de Control</h1>
        
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="info">Información</TabsTrigger>
            <TabsTrigger value="availability">Disponibilidad</TabsTrigger>
            <TabsTrigger value="appointments">Citas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Información del médico</CardTitle>
                  <CardDescription>Tu información profesional</CardDescription>
                </CardHeader>
                <CardContent>
                  {doctorData && (
                    <div className="space-y-2">
                      <p><strong>Nombre:</strong> {doctorData.name}</p>
                      <p><strong>Especialidad:</strong> {doctorData.specialty}</p>
                      <p><strong>Email:</strong> {user?.email}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Próximas citas</CardTitle>
                  <CardDescription>Citas programadas para los próximos días</CardDescription>
                </CardHeader>
                <CardContent>
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-3">
                      {upcomingAppointments.map(apt => (
                        <div key={apt.id} className="p-3 border rounded-lg">
                          <p className="font-medium">{apt.patient_name}</p>
                          <p className="text-sm text-muted-foreground">{formatDate(apt.appointment_date)}</p>
                          <p className="text-sm">{apt.start_time} - {apt.end_time}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p>No hay citas programadas</p>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Estadísticas</CardTitle>
                  <CardDescription>Resumen de actividad</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Total de citas:</strong> {appointments.length}</p>
                    <p><strong>Citas pendientes:</strong> {appointments.filter(a => a.status === 'confirmed').length}</p>
                    <p><strong>Citas para hoy:</strong> {
                      appointments.filter(a => {
                        const today = new Date();
                        const aptDate = new Date(a.appointment_date);
                        return aptDate.toDateString() === today.toDateString() && a.status === 'confirmed';
                      }).length
                    }</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="availability">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Gestión de Disponibilidad
                  </CardTitle>
                  <CardDescription>
                    Configura tu horario semanal de atención
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <WeeklyCalendar 
                  onAvailabilityChange={handleAvailabilityChange}
                  initialAvailability={availabilities}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Gestión de Citas
                </CardTitle>
                <CardDescription>
                  Administra tus citas programadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {appointments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Horario</TableHead>
                          <TableHead>Paciente</TableHead>
                          <TableHead>RUT</TableHead>
                          <TableHead>Contacto</TableHead>
                          <TableHead>Estado</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointments.map(appointment => (
                          <TableRow key={appointment.id}>
                            <TableCell className="font-medium">{formatDate(appointment.appointment_date)}</TableCell>
                            <TableCell>{appointment.start_time} - {appointment.end_time}</TableCell>
                            <TableCell>{appointment.patient_name}</TableCell>
                            <TableCell>{appointment.patient_rut}</TableCell>
                            <TableCell>
                              <div>
                                <p className="text-sm">{appointment.patient_email}</p>
                                <p className="text-sm text-muted-foreground">{appointment.patient_phone}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                appointment.status === 'confirmed' 
                                  ? 'bg-green-100 text-green-800' 
                                  : appointment.status === 'cancelled' 
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-blue-100 text-blue-800'
                              }`}>
                                {appointment.status === 'confirmed' ? 'Confirmada' : 
                                 appointment.status === 'cancelled' ? 'Cancelada' : 'Completada'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No hay citas programadas para mostrar
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

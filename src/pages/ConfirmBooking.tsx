
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link, useLocation, Navigate } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface BookingInfo {
  patient: {
    name: string;
    rut: string;
    email: string;
    phone: string;
  };
  slot: {
    id: string;
    date: Date;
    startTime: string;
    endTime: string;
  };
  doctor: string;
}

const ConfirmBooking = () => {
  const location = useLocation();
  const bookingInfo = location.state as BookingInfo;

  // Si no hay información de reserva, redirigir a la página de reserva
  if (!bookingInfo || !bookingInfo.slot || !bookingInfo.patient) {
    return <Navigate to="/booking" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto">
          <Card className="border-primary">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="h-16 w-16 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mb-2">¡Reserva Confirmada!</h1>
                <p className="text-muted-foreground mb-6">
                  Tu hora médica ha sido agendada con éxito.
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h2 className="text-sm font-medium text-muted-foreground">Paciente</h2>
                  <p className="text-lg">{bookingInfo.patient.name}</p>
                </div>
                
                <div>
                  <h2 className="text-sm font-medium text-muted-foreground">Médico</h2>
                  <p className="text-lg">{bookingInfo.doctor}</p>
                </div>
                
                <div>
                  <h2 className="text-sm font-medium text-muted-foreground">Fecha</h2>
                  <p className="text-lg">
                    {format(new Date(bookingInfo.slot.date), "EEEE d 'de' MMMM, yyyy", { locale: es })}
                  </p>
                </div>
                
                <div>
                  <h2 className="text-sm font-medium text-muted-foreground">Hora</h2>
                  <p className="text-lg">{bookingInfo.slot.startTime} - {bookingInfo.slot.endTime}</p>
                </div>
              </div>
              
              <div className="bg-accent p-4 rounded-md mb-6">
                <h3 className="font-medium mb-2">Información importante</h3>
                <ul className="text-sm space-y-1">
                  <li>• Se ha enviado un correo de confirmación a tu email.</li>
                  <li>• Recibirás un recordatorio 24 horas antes de tu cita.</li>
                  <li>• Si necesitas cancelar o reprogramar, hazlo con al menos 6 horas de anticipación.</li>
                </ul>
              </div>
              
              <div className="flex flex-col space-y-2">
                <Button asChild>
                  <Link to="/">Volver a Inicio</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/booking">Agendar otra hora</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ConfirmBooking;

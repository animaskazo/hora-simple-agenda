
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <section className="py-12 md:py-20 bg-accent">
          <div className="container mx-auto text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
              Agendamiento Médico Simple
            </h1>
            <p className="text-xl md:max-w-2xl mx-auto mb-8">
              Plataforma intuitiva para que médicos gestionen su disponibilidad y pacientes reserven fácilmente su hora médica.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/booking">Agendar hora médica</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/doctor/register">Soy médico</Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section className="py-16 container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">¿Cómo funciona?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-medium mb-3">Para pacientes</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">1</span>
                  <span>Selecciona la especialidad médica que necesitas</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">2</span>
                  <span>Elige el médico de tu preferencia</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">3</span>
                  <span>Selecciona un horario disponible</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">4</span>
                  <span>Ingresa tus datos y confirma tu reserva</span>
                </li>
              </ul>
              <div className="mt-6">
                <Button className="w-full" asChild>
                  <Link to="/booking">Agendar ahora</Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-medium mb-3">Para médicos</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">1</span>
                  <span>Regístrate de forma rápida y gratuita</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">2</span>
                  <span>Configura tus horarios de atención</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">3</span>
                  <span>Recibe notificaciones de nuevas reservas</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">4</span>
                  <span>Gestiona tu agenda desde cualquier dispositivo</span>
                </li>
              </ul>
              <div className="mt-6">
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/doctor/register">Registrarme como médico</Link>
                </Button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border md:col-span-2 lg:col-span-1">
              <h3 className="text-xl font-medium mb-3">Ventajas</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">✓</div>
                  <span>Sin comisiones por reserva</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">✓</div>
                  <span>Sistema minimalista y fácil de usar</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">✓</div>
                  <span>Optimizado para móviles y todos los dispositivos</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">✓</div>
                  <span>Recordatorios automáticos para pacientes</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center mr-2 mt-0.5">✓</div>
                  <span>Sin necesidad de crear cuenta para pacientes</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;


import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link, useNavigate, useLocation } from "react-router-dom";

interface LocationState {
  registrationSuccess?: boolean;
  email?: string;
}

const DoctorLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const state = location.state as LocationState;
  
  const [formData, setFormData] = useState({
    email: state?.email || "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Mostrar mensaje de éxito si viene de registro
    if (state?.registrationSuccess) {
      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada correctamente",
      });
    }
  }, [state, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpiar error al editar
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: formData.email 
        ? /^\S+@\S+\.\S+$/.test(formData.email) 
          ? "" 
          : "Email inválido"
        : "Email es requerido",
      password: formData.password 
        ? "" 
        : "Contraseña es requerida",
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // En una aplicación real aquí se validaría contra un backend
      // Para esta demo, simulamos un inicio de sesión exitoso
      navigate("/doctor/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Inicio de sesión</CardTitle>
              <CardDescription>
                Accede a tu cuenta para gestionar tus horas médicas
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="doctor@ejemplo.com"
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>
                
                <div className="flex items-center justify-end">
                  <Link to="#" className="text-sm text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                
                <Button type="submit" className="w-full mt-6">
                  Iniciar sesión
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                ¿No tienes cuenta?{" "}
                <Link to="/doctor/register" className="text-primary hover:underline">
                  Regístrate
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DoctorLogin;

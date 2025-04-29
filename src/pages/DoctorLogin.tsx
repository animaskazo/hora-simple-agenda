
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface LocationState {
  registrationSuccess?: boolean;
  email?: string;
}

const DoctorLogin = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  const { signIn, loading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: state?.email || "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      await signIn(formData.email, formData.password);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-noir">
      <Header />
      
      <main className="flex-1 container mx-auto py-16 px-4">
        <div className="max-w-md mx-auto">
          <Card className="bg-noir-light border-noir-dark shadow-xl">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl font-heading text-white">Inicio de sesión</CardTitle>
              <CardDescription className="text-gray-300">
                Accede a tu cuenta para gestionar tus horas médicas
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-200">Correo electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="doctor@ejemplo.com"
                    disabled={loading}
                    className="bg-noir-dark border-gray-700 text-white placeholder:text-gray-500"
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-200">Contraseña</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    className="bg-noir-dark border-gray-700 text-white"
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>
                
                <div className="flex items-center justify-end">
                  <Link to="#" className="text-sm text-primary hover:underline">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
                
                <Button type="submit" className="w-full mt-8" disabled={loading}>
                  {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-400">
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

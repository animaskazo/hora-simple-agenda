
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";

const DoctorRegister = () => {
  const { signUp, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialty: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialty: "",
  });

  const specialties = [
    "Medicina General",
    "Pediatría",
    "Ginecología",
    "Dermatología",
    "Cardiología",
    "Oftalmología",
    "Odontología",
    "Psiquiatría",
    "Psicología",
    "Nutrición",
  ];

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

  const handleSpecialtyChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      specialty: value,
    }));
    
    // Limpiar error al seleccionar especialidad
    if (errors.specialty) {
      setErrors(prev => ({
        ...prev,
        specialty: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: formData.name ? "" : "Nombre es requerido",
      email: formData.email 
        ? /^\S+@\S+\.\S+$/.test(formData.email) 
          ? "" 
          : "Email inválido"
        : "Email es requerido",
      password: formData.password.length >= 6 
        ? "" 
        : "Contraseña debe tener al menos 6 caracteres",
      confirmPassword: formData.confirmPassword === formData.password
        ? ""
        : "Las contraseñas no coinciden",
      specialty: formData.specialty ? "" : "Especialidad es requerida",
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      await signUp(
        formData.email, 
        formData.password, 
        {
          name: formData.name, 
          specialty: formData.specialty
        }
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Registro de Médico</CardTitle>
              <CardDescription>
                Crea tu cuenta para ofrecer horas de consulta online
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Dr. Juan Pérez"
                    disabled={loading}
                  />
                  {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="doctor@ejemplo.com"
                    disabled={loading}
                  />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidad</Label>
                  <Select 
                    onValueChange={handleSpecialtyChange}
                    value={formData.specialty}
                    disabled={loading}
                  >
                    <SelectTrigger id="specialty">
                      <SelectValue placeholder="Selecciona tu especialidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {specialties.map((specialty) => (
                        <SelectItem key={specialty} value={specialty}>
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.specialty && <p className="text-sm text-destructive">{errors.specialty}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirma contraseña</Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>
                
                <Button type="submit" className="w-full mt-6" disabled={loading}>
                  {loading ? "Procesando..." : "Registrarme"}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex justify-center">
              <p className="text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Link to="/doctor/login" className="text-primary hover:underline">
                  Iniciar sesión
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

export default DoctorRegister;

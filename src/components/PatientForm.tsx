
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

interface PatientFormProps {
  selectedSlot: {
    id: string;
    date: Date;
    startTime: string;
    endTime: string;
  } | null;
  doctorName: string;
}

const PatientForm = ({ selectedSlot, doctorName }: PatientFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    rut: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    rut: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Limpiar error al editar
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: formData.name ? "" : "Nombre es requerido",
      rut: formData.rut ? "" : "RUT es requerido",
      email: formData.email 
        ? /^\S+@\S+\.\S+$/.test(formData.email) 
          ? "" 
          : "Email inválido"
        : "Email es requerido",
      phone: formData.phone ? "" : "Teléfono es requerido",
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // En una aplicación real aquí se enviaría la reserva al backend
      // Para esta demo, simulamos que la reserva fue exitosa y redirigimos
      navigate("/booking/confirm", { 
        state: { 
          patient: formData,
          slot: selectedSlot,
          doctor: doctorName
        } 
      });
    }
  };

  if (!selectedSlot) {
    return (
      <div className="bg-muted p-4 rounded-md text-center">
        Por favor, selecciona un horario para continuar.
      </div>
    );
  }

  return (
    <div className="border rounded-md p-6">
      <h3 className="text-lg font-medium mb-4">Datos del paciente</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre completo</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: María González"
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="rut">RUT</Label>
          <Input
            id="rut"
            name="rut"
            value={formData.rut}
            onChange={handleChange}
            placeholder="Ej: 12.345.678-9"
          />
          {errors.rut && <p className="text-sm text-destructive">{errors.rut}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ej: maria@ejemplo.cl"
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Ej: +56 9 1234 5678"
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
        </div>
        
        <Button type="submit" className="w-full mt-6">
          Confirmar reserva
        </Button>
      </form>
    </div>
  );
};

export default PatientForm;

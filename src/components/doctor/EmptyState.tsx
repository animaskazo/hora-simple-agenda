
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const EmptyState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-8">
      <p className="text-destructive">No se encontró información del médico</p>
      <Button 
        variant="outline" 
        onClick={() => navigate("/")}
        className="mt-4"
      >
        Volver a Inicio
      </Button>
    </div>
  );
};

export default EmptyState;

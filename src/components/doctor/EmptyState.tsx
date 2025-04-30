
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CalendarX } from "lucide-react";

interface EmptyStateProps {
  message?: string;
  showButton?: boolean;
}

const EmptyState = ({ 
  message = "No se encontró información", 
  showButton = true 
}: EmptyStateProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-8 space-y-4">
      <div className="flex justify-center">
        <CalendarX className="h-10 w-10 text-muted-foreground mb-2" />
      </div>
      <p className="text-muted-foreground">{message}</p>
      {showButton && (
        <Button 
          variant="outline" 
          onClick={() => navigate("/")}
          className="mt-2"
        >
          Volver a Inicio
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

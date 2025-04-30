
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

interface ErrorStateProps {
  errorMessage: string;
  showButton?: boolean;
  onRetry?: () => void;
}

const ErrorState = ({ 
  errorMessage, 
  showButton = true, 
  onRetry 
}: ErrorStateProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-8 space-y-4">
      <div className="flex justify-center">
        <AlertTriangle className="h-10 w-10 text-destructive" />
      </div>
      <p className="text-destructive">{errorMessage}</p>
      <div className="space-x-2">
        {onRetry && (
          <Button 
            variant="outline" 
            onClick={onRetry}
            className="mt-2"
          >
            Reintentar
          </Button>
        )}
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
    </div>
  );
};

export default ErrorState;

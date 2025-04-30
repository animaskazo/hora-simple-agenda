
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ErrorStateProps {
  errorMessage: string;
}

const ErrorState = ({ errorMessage }: ErrorStateProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-8">
      <p className="text-destructive">{errorMessage}</p>
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

export default ErrorState;

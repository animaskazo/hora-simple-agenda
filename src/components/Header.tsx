
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  isDoctor?: boolean;
}

const Header = ({ isDoctor = false }: HeaderProps) => {
  const { user, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <header className="border-b py-4 px-6 bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold text-primary">
          MediHora
        </Link>
        <div>
          {user ? (
            <Button variant="ghost" onClick={handleSignOut}>
              Cerrar Sesión
            </Button>
          ) : (
            <div className="space-x-2">
              <Button variant="ghost" asChild>
                <Link to="/doctor/login">Acceso Médicos</Link>
              </Button>
              <Button variant="default" asChild>
                <Link to="/booking">Agendar Hora</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Páginas
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DoctorRegister from "./pages/DoctorRegister";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientBooking from "./pages/PatientBooking";
import ConfirmBooking from "./pages/ConfirmBooking";
import DoctorAvailabilityView from "./pages/DoctorAvailabilityView";

const queryClient = new QueryClient();

const AppWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/doctor/register" element={<DoctorRegister />} />
        <Route path="/doctor/login" element={<DoctorLogin />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/doctor/:doctorId" element={<DoctorAvailabilityView />} />
        <Route path="/booking" element={<PatientBooking />} />
        <Route path="/booking/confirm" element={<ConfirmBooking />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppWithProviders />
    </AuthProvider>
  </BrowserRouter>
);

export default App;

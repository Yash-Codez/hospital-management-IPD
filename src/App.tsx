import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import AdmissionForm from "./pages/AdmissionForm";
import AdmissionList from "./pages/AdmissionList";
import AdmissionDetails from "./pages/AdmissionDetails";
import BedManagement from "./pages/BedManagement";
import DoctorsPage from "./pages/DoctorsPage";
import MedicationsPage from "./pages/MedicationsPage";
import LabOrdersPage from "./pages/LabOrdersPage";
import BillingPage from "./pages/BillingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="admissions" element={<AdmissionList />} />
              <Route path="admit" element={<AdmissionForm />} />
              <Route path="admission/:id" element={<AdmissionDetails />} />
              <Route path="beds" element={<BedManagement />} />
              <Route path="doctors" element={<DoctorsPage />} />
              <Route path="medications" element={<MedicationsPage />} />
              <Route path="lab-orders" element={<LabOrdersPage />} />
              <Route path="billing" element={<BillingPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

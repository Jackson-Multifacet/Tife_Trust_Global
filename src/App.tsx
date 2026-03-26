import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { LoadingProvider } from "@/context/LoadingContext";
import { GlobalLoading } from "@/components/GlobalLoading";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuthPersistence } from "@/hooks/useAuthPersistence";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import MainLayout from "@/components/layout/MainLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Services from "@/pages/Services";
import Team from "@/pages/Team";
import PortalLogin from "@/pages/PortalLogin";
import StaffDashboard from "@/pages/StaffDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminSettings from "@/pages/AdminSettings";
import CandidateForm from "@/pages/CandidateForm";
import ApplicationsList from "@/pages/portal/ApplicationsList";
import StaffManagement from "@/pages/portal/StaffManagement";
import StaffSettings from "@/pages/portal/StaffSettings";
import { Toaster } from "@/components/ui/sonner";

function AppContent() {
  useAuthPersistence();

  return (
    <Routes>
      {/* Main Site Routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/candidate-form" element={<CandidateForm />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/team" element={<Team />} />
      </Route>

      {/* Portal Auth */}
      <Route path="/portal/login" element={<PortalLogin />} />

      {/* Staff Dashboard - Protected */}
      <Route
        path="/portal/staff"
        element={
          <ProtectedRoute requiredRole="staff">
            <DashboardLayout role="staff" />
          </ProtectedRoute>
        }
      >
        <Route index element={<StaffDashboard />} />
        <Route path="applications" element={<ApplicationsList />} />
        <Route path="settings" element={<StaffSettings />} />
      </Route>

      {/* Admin Dashboard - Protected */}
      <Route
        path="/portal/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <DashboardLayout role="admin" />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<StaffManagement />} />
        <Route path="applications" element={<ApplicationsList />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="tife-trust-theme">
      <LoadingProvider>
        <GlobalLoading />
        <Toaster position="top-right" richColors />
        <ErrorBoundary>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </ErrorBoundary>
      </LoadingProvider>
    </ThemeProvider>
  );
}

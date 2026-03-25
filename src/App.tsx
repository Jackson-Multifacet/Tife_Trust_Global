import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/theme-provider"
import { LoadingProvider } from "@/context/LoadingContext"
import { GlobalLoading } from "@/components/GlobalLoading"
import MainLayout from "@/components/layout/MainLayout"
import DashboardLayout from "@/components/layout/DashboardLayout"
import Home from "@/pages/Home"
import About from "@/pages/About"
import Services from "@/pages/Services"
import PortalLogin from "@/pages/PortalLogin"
import StaffDashboard from "@/pages/StaffDashboard"
import AdminDashboard from "@/pages/AdminDashboard"
import AdminSettings from "@/pages/AdminSettings"
import CandidateForm from "@/pages/CandidateForm"
import ApplicationsList from "@/pages/portal/ApplicationsList"
import StaffManagement from "@/pages/portal/StaffManagement"
import StaffSettings from "@/pages/portal/StaffSettings"
import { Toaster } from "@/components/ui/sonner"

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="tife-trust-theme">
      <LoadingProvider>
        <GlobalLoading />
        <Toaster position="top-right" richColors />
        <BrowserRouter>
          <Routes>
            {/* Main Site Routes */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/candidate-form" element={<CandidateForm />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
            </Route>

            {/* Portal Auth */}
            <Route path="/portal/login" element={<PortalLogin />} />

            {/* Staff Dashboard */}
            <Route path="/portal/staff" element={<DashboardLayout role="staff" />}>
              <Route index element={<StaffDashboard />} />
              <Route path="applications" element={<ApplicationsList />} />
              <Route path="settings" element={<StaffSettings />} />
            </Route>

            {/* Admin Dashboard */}
            <Route path="/portal/admin" element={<DashboardLayout role="admin" />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<StaffManagement />} />
              <Route path="applications" element={<ApplicationsList />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </LoadingProvider>
    </ThemeProvider>
  )
}

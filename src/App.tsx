import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Layouts
import MainLayout from "@/layouts/MainLayout";
import AdminLayout from "@/layouts/AdminLayout";
import AdminDashboardLayout from "@/layouts/AdminDashboardLayout";
import RequireAdmin from "@/components/auth/RequireAdmin";

// Public Pages
import HomePage from "./pages/HomePage";
import LayananPage from "./pages/LayananPage";
import BeritaPage from "./pages/BeritaPage";
import BeritaDetailPage from "./pages/BeritaDetailPage";
import PengaduanPage from "./pages/PengaduanPage";
import NotFound from "./pages/NotFound";

// Simple test component
const TestPage = () => (
  <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f0f0f0' }}>
    <h1>Test Page Works!</h1>
    <p>If you can see this, routing is working.</p>
    <a href="/berita">Back to Berita</a>
  </div>
);

// Admin Pages
import LoginPage from "./pages/admin/LoginPage";
import DashboardPage from "./pages/admin/DashboardPage";
import PengaduanAdminPage from "./pages/admin/PengaduanPage";
import PengaduanDetailPage from "./pages/admin/PengaduanDetailPage";
import BeritaAdminPage from "./pages/admin/BeritaPage";
import BeritaDetailAdminPage from "./pages/admin/BeritaDetailAdminPage";
import BeritaFormPage from "./pages/admin/BeritaFormPage";
import AgendaAdminPage from "./pages/admin/AgendaPage";
import AgendaDetailAdminPage from "./pages/admin/AgendaDetailPage";
import AgendaFormPage from "./pages/admin/AgendaFormPage";
import PengaturanPage from "./pages/admin/PengaturanPage";

// Components
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import LoadingScreen from "@/components/LoadingScreen";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes with main layout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/layanan" element={<LayananPage />} />
            <Route path="/berita" element={<BeritaPage />} />
            <Route path="/berita/:id" element={<BeritaDetailPage />} />
            <Route path="/pengaduan" element={<PengaduanPage />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
          
          {/* Test route without layout for debugging */}
          <Route path="/test" element={<TestPage />} />

          {/* Admin login page */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route index element={<Navigate to="login" replace />} />
          </Route>

          {/* Admin dashboard routes */}
          <Route path="/admin" element={<RequireAdmin />}>
            <Route element={<AdminDashboardLayout />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="pengaduan" element={<PengaduanAdminPage />} />
              <Route path="pengaduan/:id" element={<PengaduanDetailPage />} />
              <Route path="berita" element={<BeritaAdminPage />} />
              <Route path="berita/:id" element={<BeritaDetailAdminPage />} />
              <Route path="berita/baru" element={<BeritaFormPage />} />
              <Route path="berita/edit/:id" element={<BeritaFormPage />} />
              <Route path="agenda" element={<AgendaAdminPage />} />
              <Route path="agenda/:id" element={<AgendaDetailAdminPage />} />
              <Route path="agenda/baru" element={<AgendaFormPage />} />
              <Route path="agenda/edit/:id" element={<AgendaFormPage />} />
              <Route path="pengaturan" element={<PengaturanPage />} />
              <Route index element={<Navigate to="dashboard" replace />} />
            </Route>
          </Route>
        </Routes>
        
        {/* Global components */}
        <LoadingScreen />
        <AccessibilityToolbar />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

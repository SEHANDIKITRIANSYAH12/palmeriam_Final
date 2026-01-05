import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/Chatbot";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import HomePage from "./pages/HomePage";
import LayananPage from "./pages/LayananPage";
import BeritaPage from "./pages/BeritaPage";
import PengaduanPage from "./pages/PengaduanPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/layanan" element={<LayananPage />} />
          <Route path="/berita" element={<BeritaPage />} />
          <Route path="/pengaduan" element={<PengaduanPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <Chatbot />
        <AccessibilityToolbar />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

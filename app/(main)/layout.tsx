"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/Chatbot";
import { Toaster } from "@/components/ui/toaster";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";
import LoadingScreen from "@/components/LoadingScreen";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
      <Chatbot />
      <Toaster />
      <AccessibilityToolbar />
      <LoadingScreen />
    </div>
  );
}

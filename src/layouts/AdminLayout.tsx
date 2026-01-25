import { Outlet } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

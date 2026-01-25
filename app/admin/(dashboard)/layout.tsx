"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, MessageSquare, Newspaper, Calendar, Settings, LogOut, Home, Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { clearAuth, getAuth } from "@/lib/auth";
import lambangJakartaTimur from "@/assets/Lambang_Kota_Jakarta_Timur.png";
import { useEffect } from "react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { name: 'Pengaduan', icon: MessageSquare, href: '/admin/pengaduan' },
    { name: 'Berita', icon: Newspaper, href: '/admin/berita' },
    { name: 'Agenda', icon: Calendar, href: '/admin/agenda' },
    { name: 'Pengaturan', icon: Settings, href: '/admin/pengaturan' },
  ];

  useEffect(() => {
    const auth = getAuth();
    if (!auth?.token || auth.user?.role !== "admin") {
      router.replace("/admin/login");
    }
  }, [router]);

  const handleLogout = () => {
    clearAuth();
    router.replace("/admin/login");
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-72 border-r border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-lg">
          {/* Logo Section */}
          <div className="flex items-center justify-center h-20 px-6 border-b border-slate-200/80 bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-lg overflow-hidden">
                <img 
                  src={lambangJakartaTimur.src || lambangJakartaTimur} 
                  alt="Lambang Kota Jakarta Timur"
                  className="w-full h-full object-contain p-1"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Admin SIPALMI
                </h1>
                <p className="text-xs text-slate-500">Kelurahan Palmeriam</p>
              </div>
            </div>
          </div>
          
          {/* Navigation */}
          <div className="flex flex-col flex-grow px-4 py-6 overflow-y-auto">
            <nav className="flex-1 space-y-1.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-primary to-primary/90 text-white shadow-lg shadow-primary/25 scale-[1.02]'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-primary hover:scale-[1.01]'
                    )}
                  >
                    <item.icon className={cn(
                      'w-5 h-5 mr-3 transition-transform duration-200',
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-primary group-hover:scale-110'
                    )} />
                    <span className={cn(
                      'transition-all duration-200',
                      isActive && 'font-semibold'
                    )}>
                      {item.name}
                    </span>
                    {isActive && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white/80"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
            
            {/* Logout Button */}
            <div className="mt-auto pt-4 border-t border-slate-200/80">
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Keluar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Link 
                href="/" 
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-slate-600 hover:text-primary hover:bg-slate-100 rounded-lg transition-all duration-200"
              >
                <Home className="w-4 h-4" />
                <span className="font-medium">Kembali ke Beranda</span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button className="relative p-2 rounded-lg text-slate-600 hover:text-primary hover:bg-slate-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                </button>
              </div>
              
              {/* User Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white font-semibold shadow-lg ring-2 ring-primary/20">
                  <User className="w-5 h-5" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-semibold text-slate-900">Admin</p>
                  <p className="text-xs text-slate-500">Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, Clock, Phone, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import lambangKotaJakartaTimur from "../../assets/Lambang_Kota_Jakarta_Timur.png";

const navigation = [
  { name: "Beranda", href: "/" },
  { name: "Layanan", href: "/layanan" },
  { name: "Berita & Agenda", href: "/berita" },
  { name: "Pengaduan", href: "/pengaduan" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <a href="#main-content" className="skip-link">
        Lewati ke konten utama
      </a>

      <div className="bg-primary text-primary-foreground">
        <div className="container-government h-8 flex items-center justify-center">
          <div className="w-full max-w-md overflow-hidden">
            <div className="flex items-center gap-6 whitespace-nowrap animate-clock-pan">
              <span className="inline-flex items-center gap-2 text-xs font-medium">
                <Clock className="w-4 h-4" />
                {currentTime.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </span>
              <span className="inline-flex items-center gap-2 text-xs font-medium">
                <Phone className="w-4 h-4" />
                (021) 1234-5678
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <nav className="container-government" aria-label="Navigasi utama">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            href="/"
            className="flex items-center gap-3 group cursor-pointer"
          >
            <Image 
              src={lambangKotaJakartaTimur} 
              alt="Lambang Kota Jakarta Timur" 
              width={56}
              height={56}
              className="h-14 w-auto object-contain"
            />
            <div className="hidden sm:block">
              <p className="font-heading font-semibold text-foreground text-lg leading-tight">
                SIPALMI
              </p>
              <p className="text-xs text-muted-foreground">
                Kelurahan Palmeriam
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link 
              href="/admin/login" 
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <LogIn className="w-5 h-5" />
              <span>Admin</span>
            </Link>
            <Link 
              href="/pengaduan"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              <span>Ajukan Pengaduan</span>
            </Link>
          </div>

          <div className="flex items-center lg:hidden gap-2">
            <Link 
              href="/admin/login" 
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              aria-label="Login Admin"
            >
              <LogIn className="w-5 h-5" />
            </Link>
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border animate-slide-up">
            <div className="flex flex-col gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 mt-2 border-t border-border">
                <Link 
                  href="/pengaduan" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  <span>Ajukan Pengaduan</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

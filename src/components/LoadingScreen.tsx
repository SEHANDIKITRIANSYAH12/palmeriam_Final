"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import lambangJakartaTimur from "../assets/Lambang_Kota_Jakarta_Timur.png";

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Set loading to true when route changes
    setIsLoading(true);

    // Simulate loading time (adjust as needed)
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600); // 600ms loading time

    return () => clearTimeout(timer);
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-primary via-primary/95 to-primary/90 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Logo dengan animasi */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full bg-white/30 blur-3xl animate-pulse"></div>
          
          {/* Logo container */}
          <div className="relative w-28 h-28 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center shadow-2xl border-2 border-white/40">
            <Image
              src={lambangJakartaTimur}
              alt="Lambang Kota Jakarta Timur"
              width={96}
              height={96}
              className="object-contain"
            />
          </div>
          
          {/* Rotating ring */}
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-white/50 border-r-white/30 animate-spin-slow"></div>
        </div>

        {/* Text */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-white tracking-wide">
            SIPALMI
          </h2>
          <p className="text-sm text-white/90 font-medium">
            Memuat halaman...
          </p>
        </div>

        {/* Loading bar */}
        <div className="w-72 h-1.5 bg-white/20 rounded-full overflow-hidden shadow-inner">
          <div className="h-full bg-gradient-to-r from-white via-white/80 to-white rounded-full animate-loading-bar shadow-lg"></div>
        </div>

        {/* Dots indicator */}
        <div className="flex gap-2 mt-2">
          <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce-delay-1"></div>
          <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce-delay-2"></div>
          <div className="w-2 h-2 rounded-full bg-white/60 animate-bounce-delay-3"></div>
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes loading-bar {
          0% {
            width: 0%;
            transform: translateX(0);
          }
          50% {
            width: 75%;
            transform: translateX(0);
          }
          100% {
            width: 100%;
            transform: translateX(0);
          }
        }
        @keyframes bounce-delay {
          0%, 80%, 100% {
            transform: translateY(0);
            opacity: 0.5;
          }
          40% {
            transform: translateY(-8px);
            opacity: 1;
          }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
        .animate-loading-bar {
          animation: loading-bar 1.2s ease-in-out infinite;
        }
        .animate-bounce-delay-1 {
          animation: bounce-delay 1.4s ease-in-out infinite;
        }
        .animate-bounce-delay-2 {
          animation: bounce-delay 1.4s ease-in-out infinite 0.2s;
        }
        .animate-bounce-delay-3 {
          animation: bounce-delay 1.4s ease-in-out infinite 0.4s;
        }
      `}</style>
    </div>
  );
}

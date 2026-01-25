"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuth } from "@/lib/auth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Skip check for login page
    if (pathname === "/admin/login") {
      const auth = getAuth();
      if (auth?.token) {
        router.replace("/admin/dashboard");
      }
      return;
    }

    // Check auth for other admin pages
    const auth = getAuth();
    if (!auth?.token) {
      router.replace(`/admin/login?from=${encodeURIComponent(pathname)}`);
      return;
    }

    if (auth.user?.role !== "admin") {
      router.replace("/");
      return;
    }
  }, [pathname, router]);

  return <>{children}</>;
}

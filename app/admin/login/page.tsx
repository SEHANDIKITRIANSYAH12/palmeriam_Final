"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Lock, User, Shield, ArrowLeft, LogIn } from "lucide-react";
import lambangJakartaTimur from "@/assets/Lambang_Kota_Jakarta_Timur.png";
import { useToast } from "@/hooks/use-toast";
import { loginApi } from "@/lib/api";
import { getAuth, setAuth } from "@/lib/auth";

function LoginPageInner() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const existing = getAuth();
    if (existing?.token) {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await loginApi(username, password);
      setAuth({ token: result.token, user: result.user });

      const fromPath = searchParams.get("from");
      router.push(fromPath || "/admin/dashboard");
      router.refresh();
      toast({ title: "Berhasil login", description: "Selamat datang di dashboard admin." });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login gagal";
      toast({ title: "Login gagal", description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-2xl overflow-hidden">
          {/* Header dengan gradient */}
          <div className="bg-gradient-to-br from-primary via-primary/95 to-primary/90 p-6 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg border-2 border-white/30 relative">
                <Image
                  src={lambangJakartaTimur}
                  alt="Lambang Kota Jakarta Timur"
                  fill
                  sizes="64px"
                  className="object-contain"
                />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white">Login Admin</h1>
                <p className="text-sm text-white/90">Sistem Informasi Kelurahan Palmeriam</p>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="mb-6 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                <Shield className="h-3.5 w-3.5" />
                <span>Akses Terbatas untuk Admin</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-semibold text-slate-700">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username"
                    autoComplete="username"
                    className="h-11 pl-10 border-slate-200 focus:border-primary focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-semibold text-slate-700">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan password"
                    autoComplete="current-password"
                    className="h-11 pl-10 border-slate-200 focus:border-primary focus:ring-primary/20"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Memproses...</span>
                  </div>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Masuk ke Dashboard
                  </>
                )}
              </Button>

              <Separator className="my-6" />

              <div className="text-center">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Kembali ke Beranda
                </Link>
              </div>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-600">
                  <p className="font-semibold text-slate-700 mb-1">Keamanan Data</p>
                  <p>Pastikan Anda menggunakan kredensial resmi. Semua aktivitas login akan tercatat untuk keamanan sistem.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}

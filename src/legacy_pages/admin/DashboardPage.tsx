import { BarChart3, MessageSquare, Newspaper, Calendar, TrendingUp, ArrowRight, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { authFetch } from "@/lib/api";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

 type Status = "Baru" | "Diproses" | "Selesai";

 type DashboardStats = {
   totalPengaduan: number;
   selesaiPengaduan: number;
   totalBerita: number;
   totalAgenda: number;
   pengaduanTerbaru: Array<{
     id: number;
     judul: string;
     status: Status;
     createdAt: string;
   }>;
 };

export default function DashboardPage() {
  const statsQuery = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: () => authFetch<DashboardStats>("/api/dashboard/stats"),
  });

  const totalPengaduan = statsQuery.data?.totalPengaduan ?? 0;
  const totalBerita = statsQuery.data?.totalBerita ?? 0;
  const totalAgenda = statsQuery.data?.totalAgenda ?? 0;
  const selesaiPengaduan = statsQuery.data?.selesaiPengaduan ?? 0;

  const cards = [
    { 
      title: "Total Pengaduan", 
      value: totalPengaduan.toString(), 
      icon: MessageSquare, 
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100/50",
      textColor: "text-blue-600",
      description: "Pengaduan masuk"
    },
    { 
      title: "Jumlah Berita", 
      value: totalBerita.toString(), 
      icon: Newspaper, 
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100/50",
      textColor: "text-purple-600",
      description: "Artikel berita"
    },
    { 
      title: "Jumlah Agenda", 
      value: totalAgenda.toString(), 
      icon: Calendar, 
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100/50",
      textColor: "text-green-600",
      description: "Kegiatan terdaftar"
    },
    { 
      title: "Pengaduan Selesai", 
      value: selesaiPengaduan.toString(), 
      icon: BarChart3, 
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100/50",
      textColor: "text-orange-600",
      description: "Terselesaikan"
    },
  ];

  const recentComplaints = statsQuery.data?.pengaduanTerbaru ?? [];

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-slate-600">
          Ringkasan aktivitas dan statistik kelurahan
        </p>
      </div>

      {statsQuery.isError && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
          Gagal memuat data: {statsQuery.error instanceof Error ? statsQuery.error.message : "Error"}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((stat, i) => (
          <Card 
            key={i} 
            className={cn(
              "relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105",
              `bg-gradient-to-br ${stat.bgGradient}`
            )}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
              <CardTitle className={cn("text-sm font-semibold", stat.textColor)}>
                {stat.title}
              </CardTitle>
              <div className={cn(
                "p-2.5 rounded-xl bg-white/80 shadow-md",
                `bg-gradient-to-br ${stat.gradient}`
              )}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className={cn("text-4xl font-bold mb-1", stat.textColor)}>
                {stat.value}
              </div>
              <p className="text-xs text-slate-600 font-medium">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Pengaduan Terbaru */}
        <Card className="col-span-4 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-900">Pengaduan Terbaru</CardTitle>
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentComplaints.length > 0 ? (
                recentComplaints.map((complaint) => (
                  <div 
                    key={complaint.id} 
                    className="group flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-primary/30 hover:bg-slate-50/50 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                        {complaint.judul}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(complaint.createdAt).toLocaleDateString("id-ID", { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}</span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "ml-4 shrink-0",
                        complaint.status === "Baru" && "bg-blue-50 text-blue-700 border-blue-200",
                        complaint.status === "Diproses" && "bg-yellow-50 text-yellow-700 border-yellow-200",
                        complaint.status === "Selesai" && "bg-green-50 text-green-700 border-green-200"
                      )}
                    >
                      {complaint.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                  <p className="text-sm">Belum ada pengaduan</p>
                </div>
              )}
              <div className="pt-2 border-t border-slate-200">
                <Link 
                  to="/admin/pengaduan" 
                  className="flex items-center justify-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors group"
                >
                  <span>Lihat Semua Pengaduan</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aktivitas Terkini */}
        <Card className="col-span-3 border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-900">Aktivitas Terkini</CardTitle>
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[
                { id: 1, text: "Admin menambahkan berita baru tentang kegiatan gotong royong", time: "2 jam lalu" },
                { id: 2, text: "Status pengaduan #1234 diubah menjadi 'Selesai'", time: "5 jam lalu" },
                { id: 3, text: "Agenda rapat RW 03 telah diupdate", time: "1 hari lalu" },
              ].map((activity, idx) => (
                <div 
                  key={activity.id} 
                  className="flex items-start gap-3 group hover:bg-slate-50/50 p-3 rounded-lg transition-colors duration-200"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-2.5 group-hover:scale-125 transition-transform"></div>
                    {idx < 2 && (
                      <div className="absolute top-4 left-1/2 w-px h-8 bg-slate-200 -translate-x-1/2"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 leading-relaxed">{activity.text}</p>
                    <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

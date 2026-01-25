"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Pencil, Trash2, Calendar as CalendarIcon, Clock, MapPin, AlertCircle, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Event = {
  id: number;
  judul: string;
  tanggal: string;
  waktuMulai: string;
  waktuSelesai: string;
  lokasi: string;
  kategori: string;
  peserta: number;
};

export default function AgendaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const qc = useQueryClient();
  
  const listQuery = useQuery({
    queryKey: ["admin-agenda"],
    queryFn: () => authFetch<Event[]>("/api/agenda"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => authFetch<void>(`/api/agenda/${id}`, { method: "DELETE" }),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["admin-agenda"] }),
        qc.invalidateQueries({ queryKey: ["admin-dashboard-stats"] }),
      ]);
      toast({ title: "Agenda dihapus" });
    },
    onError: (err) => {
      toast({
        title: "Gagal menghapus",
        description: err instanceof Error ? err.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    },
  });

  const filteredEvents = useMemo(() => {
    const rows = listQuery.data ?? [];
    const q = searchQuery.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((e) => e.judul.toLowerCase().includes(q) || e.kategori.toLowerCase().includes(q));
  }, [listQuery.data, searchQuery]);

  const isUpcoming = (tanggal: string) => {
    const dt = new Date(tanggal);
    return dt.getTime() >= new Date().setHours(0, 0, 0, 0);
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Kelola Agenda
          </h1>
          <p className="text-slate-600">
            Kelola agenda dan jadwal kegiatan kelurahan
          </p>
        </div>
        <Button asChild className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg">
          <Link href="/admin/agenda/baru" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tambah Agenda
          </Link>
        </Button>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/50">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Cari agenda berdasarkan judul atau kategori..."
              className="pl-10 h-11 border-slate-200 focus:border-primary focus:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-0 shadow-lg overflow-hidden">
        {listQuery.isError && (
          <div className="p-6 bg-red-50 border-b border-red-200">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">
                Gagal memuat data: {listQuery.error instanceof Error ? listQuery.error.message : "Error"}
              </p>
            </div>
          </div>
        )}
        {listQuery.isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-slate-500">Memuat data agenda...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-12 text-center">
            <CalendarIcon className="h-16 w-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Tidak ada agenda</h3>
            <p className="text-sm text-slate-500 mb-6">
              {searchQuery 
                ? 'Tidak ada agenda yang sesuai dengan pencarian Anda' 
                : 'Mulai dengan menambahkan agenda baru'}
            </p>
            {!searchQuery && (
              <Button asChild className="bg-gradient-to-r from-primary to-primary/90">
                <Link href="/admin/agenda/baru">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Agenda
                </Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="font-semibold text-slate-700">Kegiatan</TableHead>
                  <TableHead className="font-semibold text-slate-700">Tanggal & Waktu</TableHead>
                  <TableHead className="font-semibold text-slate-700">Lokasi</TableHead>
                  <TableHead className="font-semibold text-slate-700">Kategori</TableHead>
                  <TableHead className="font-semibold text-slate-700">Peserta</TableHead>
                  <TableHead className="font-semibold text-slate-700">Status</TableHead>
                  <TableHead className="w-[100px] font-semibold text-slate-700">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => {
                  const upcoming = isUpcoming(event.tanggal);
                  return (
                    <TableRow 
                      key={event.id}
                      className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                    >
                      <TableCell className="font-medium">
                        <Link 
                          href={`/admin/agenda/${event.id}`} 
                          className="text-slate-900 hover:text-primary transition-colors group-hover:underline"
                        >
                          {event.judul}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                            <CalendarIcon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="text-sm">
                            <div className="font-medium text-slate-900">
                              {new Date(event.tanggal).toLocaleDateString("id-ID", {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                              })}
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600 mt-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{event.waktuMulai} - {event.waktuSelesai}</span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                          <span className="line-clamp-1">{event.lokasi}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className="bg-green-50 text-green-700 border-green-200 font-medium"
                        >
                          {event.kategori}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <Users className="h-4 w-4 text-slate-400" />
                          <span className="font-medium">{event.peserta}</span>
                          <span className="text-slate-500">orang</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-medium",
                            upcoming 
                              ? 'bg-blue-50 text-blue-700 border-blue-200' 
                              : 'bg-slate-50 text-slate-700 border-slate-200'
                          )}
                        >
                          {upcoming ? 'Akan Datang' : 'Selesai'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                            asChild
                          >
                            <Link href={`/admin/agenda/edit/${event.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                              if (window.confirm('Apakah Anda yakin ingin menghapus agenda ini?')) {
                                deleteMutation.mutate(event.id);
                              }
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  );
}

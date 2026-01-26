import { useMemo, useState } from "react";
import { Search, Filter, Download, MoreHorizontal, MessageSquare, AlertCircle, ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

type Status = 'Baru' | 'Diproses' | 'Selesai';

interface Complaint {
  id: number;
  judul: string;
  kategori: string;
  status: Status;
  createdAt: string;
  pelaporNama: string;
  prioritas: string;
}

export default function PengaduanPage() {
  const [statusFilter, setStatusFilter] = useState<Status | 'Semua'>('Semua');
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const qc = useQueryClient();
  
  const listQuery = useQuery({
    queryKey: ["admin-pengaduan"],
    queryFn: () => authFetch<Complaint[]>("/api/pengaduan"),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: Status }) =>
      authFetch<Complaint>(`/api/pengaduan/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["admin-pengaduan"] }),
        qc.invalidateQueries({ queryKey: ["admin-dashboard-stats"] }),
      ]);
      toast({ title: "Status pengaduan diperbarui" });
    },
    onError: (err) => {
      toast({
        title: "Gagal memperbarui",
        description: err instanceof Error ? err.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      authFetch<void>(`/api/pengaduan/${id}`, {
        method: "DELETE",
      }),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["admin-pengaduan"] }),
        qc.invalidateQueries({ queryKey: ["admin-dashboard-stats"] }),
      ]);
      toast({ title: "Pengaduan dihapus" });
    },
    onError: (err) => {
      toast({
        title: "Gagal menghapus",
        description: err instanceof Error ? err.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    },
  });

  const filteredComplaints = useMemo(() => {
    const rows = listQuery.data ?? [];
    const byStatus = statusFilter === "Semua" ? rows : rows.filter((r) => r.status === statusFilter);
    const q = searchQuery.trim().toLowerCase();
    if (!q) return byStatus;
    return byStatus.filter((r) =>
      r.judul.toLowerCase().includes(q) ||
      r.kategori.toLowerCase().includes(q) ||
      r.pelaporNama.toLowerCase().includes(q),
    );
  }, [listQuery.data, searchQuery, statusFilter]);

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Kelola Pengaduan
          </h1>
          <p className="text-slate-600">
            Kelola pengaduan masyarakat dengan transparan
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 hover:bg-slate-100 transition-colors">
            <Download className="h-4 w-4" />
            Ekspor
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50/50">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Cari pengaduan berdasarkan judul, kategori, atau pelapor..."
                className="pl-10 h-11 border-slate-200 focus:border-primary focus:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as Status | 'Semua')}>
                <SelectTrigger className="w-[180px] h-11 border-slate-200 focus:border-primary focus:ring-primary/20">
                  <Filter className="h-4 w-4 mr-2 text-slate-400" />
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Semua">Semua Status</SelectItem>
                  <SelectItem value="Baru">Baru</SelectItem>
                  <SelectItem value="Diproses">Diproses</SelectItem>
                  <SelectItem value="Selesai">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
            <p className="text-sm text-slate-500">Memuat data pengaduan...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="p-12 text-center">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-slate-300" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Tidak ada pengaduan</h3>
            <p className="text-sm text-slate-500">
              {searchQuery || statusFilter !== 'Semua' 
                ? 'Tidak ada pengaduan yang sesuai dengan filter Anda' 
                : 'Belum ada pengaduan yang masuk'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                  <TableHead className="font-semibold text-slate-700">ID</TableHead>
                  <TableHead className="font-semibold text-slate-700">Judul</TableHead>
                  <TableHead className="font-semibold text-slate-700">Kategori</TableHead>
                  <TableHead className="font-semibold text-slate-700">Pelapor</TableHead>
                  <TableHead className="font-semibold text-slate-700">Tanggal</TableHead>
                  <TableHead className="font-semibold text-slate-700">Prioritas</TableHead>
                  <TableHead className="font-semibold text-slate-700">Status</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComplaints.map((complaint) => (
                  <TableRow 
                    key={complaint.id}
                    className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  >
                    <TableCell className="font-medium text-slate-900">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary font-semibold text-sm">
                        #{complaint.id}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      <Link 
                        to={`/admin/pengaduan/${complaint.id}`} 
                        className="text-slate-900 hover:text-primary transition-colors group-hover:underline"
                      >
                        {complaint.judul}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="text-slate-600">{complaint.kategori}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-xs font-medium">
                          {complaint.pelaporNama.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-slate-700">{complaint.pelaporNama}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-600">
                      {new Date(complaint.createdAt).toLocaleDateString("id-ID", {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-medium",
                          complaint.prioritas === 'Tinggi' && 'bg-red-50 text-red-700 border-red-200',
                          complaint.prioritas === 'Sedang' && 'bg-yellow-50 text-yellow-700 border-yellow-200',
                          complaint.prioritas === 'Rendah' && 'bg-slate-50 text-slate-700 border-slate-200'
                        )}
                      >
                        {complaint.prioritas}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-medium",
                          complaint.status === 'Baru' && 'bg-blue-50 text-blue-700 border-blue-200',
                          complaint.status === 'Diproses' && 'bg-orange-50 text-orange-700 border-orange-200',
                          complaint.status === 'Selesai' && 'bg-green-50 text-green-700 border-green-200'
                        )}
                      >
                        {complaint.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="h-8 w-8 hover:bg-slate-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem 
                            onClick={() => updateStatusMutation.mutate({ id: complaint.id, status: 'Baru' })}
                            className="cursor-pointer"
                          >
                            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                            Tandai sebagai Baru
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => updateStatusMutation.mutate({ id: complaint.id, status: 'Diproses' })}
                            className="cursor-pointer"
                          >
                            <span className="w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
                            Tandai sebagai Diproses
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => updateStatusMutation.mutate({ id: complaint.id, status: 'Selesai' })}
                            className="cursor-pointer"
                          >
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                            Tandai sebagai Selesai
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
                            onClick={() => deleteMutation.mutate(complaint.id)}
                          >
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {filteredComplaints.length > 0 && (
        <div className="flex items-center justify-between bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
          <div className="text-sm text-slate-600">
            Menampilkan <span className="font-semibold text-slate-900">1-{filteredComplaints.length}</span> dari{' '}
            <span className="font-semibold text-slate-900">{filteredComplaints.length}</span> pengaduan
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Sebelumnya
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              disabled={filteredComplaints.length <= 10}
              className="gap-2"
            >
              Selanjutnya
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

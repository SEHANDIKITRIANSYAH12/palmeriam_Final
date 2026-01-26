import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { authFetch } from "@/lib/api";

type Status = "Baru" | "Diproses" | "Selesai";

type Pengaduan = {
  id: number;
  judul: string;
  deskripsi: string;
  kategori: string;
  status: Status;
  prioritas: string;
  pelaporNama: string;
  pelaporKontak?: string | null;
  lokasi?: string | null;
  createdAt: string;
};

export default function PengaduanDetailPage() {
  const { id } = useParams();
  const complaintId = Number(id);
  const { toast } = useToast();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["admin-pengaduan", complaintId],
    queryFn: () => authFetch<Pengaduan>(`/api/pengaduan/${complaintId}`),
    enabled: Number.isFinite(complaintId),
  });

  const statusMutation = useMutation({
    mutationFn: (status: Status) =>
      authFetch<Pengaduan>(`/api/pengaduan/${complaintId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
    onSuccess: async () => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["admin-pengaduan"] }),
        qc.invalidateQueries({ queryKey: ["admin-pengaduan", complaintId] }),
        qc.invalidateQueries({ queryKey: ["admin-dashboard-stats"] }),
      ]);
      toast({ title: "Status diperbarui" });
    },
    onError: (err) => {
      toast({
        title: "Gagal memperbarui",
        description: err instanceof Error ? err.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    },
  });

  const statusBadgeClass = useMemo(() => {
    const status = query.data?.status;
    if (status === "Baru") return "bg-blue-100 text-blue-800";
    if (status === "Diproses") return "bg-yellow-100 text-yellow-800";
    if (status === "Selesai") return "bg-green-100 text-green-800";
    return "";
  }, [query.data?.status]);

  if (query.isLoading) {
    return <div>Memuat...</div>;
  }

  if (query.isError) {
    return <div>Gagal memuat pengaduan: {query.error instanceof Error ? query.error.message : "Error"}</div>;
  }

  if (!query.data) {
    return <div>Pengaduan tidak ditemukan.</div>;
  }

  const p = query.data;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Detail Pengaduan</h1>
          <p className="text-muted-foreground">#{p.id}</p>
        </div>
        <Badge className={statusBadgeClass}>{p.status}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{p.judul}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <div className="text-sm text-muted-foreground">Kategori</div>
            <div className="font-medium">{p.kategori}</div>
          </div>

          <div className="grid gap-2">
            <div className="text-sm text-muted-foreground">Pelapor</div>
            <div className="font-medium">{p.pelaporNama}</div>
          </div>

          <div className="grid gap-2">
            <div className="text-sm text-muted-foreground">Deskripsi</div>
            <div className="whitespace-pre-wrap">{p.deskripsi}</div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => statusMutation.mutate("Baru")}
              disabled={statusMutation.isPending}
            >
              Baru
            </Button>
            <Button
              variant="outline"
              onClick={() => statusMutation.mutate("Diproses")}
              disabled={statusMutation.isPending}
            >
              Diproses
            </Button>
            <Button
              onClick={() => statusMutation.mutate("Selesai")}
              disabled={statusMutation.isPending}
            >
              Selesai
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

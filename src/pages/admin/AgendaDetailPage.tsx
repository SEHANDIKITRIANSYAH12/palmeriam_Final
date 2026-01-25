import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authFetch } from "@/lib/api";

type Agenda = {
  id: number;
  judul: string;
  deskripsi: string;
  tanggal: string;
  waktuMulai: string;
  waktuSelesai: string;
  lokasi: string;
  kategori: string;
  peserta: number;
};

export default function AgendaDetailPage() {
  const { id } = useParams();
  const agendaId = Number(id);

  const query = useQuery({
    queryKey: ["admin-agenda", agendaId],
    queryFn: () => authFetch<Agenda>(`/api/agenda/${agendaId}`),
    enabled: Number.isFinite(agendaId),
  });

  if (query.isLoading) return <div>Memuat...</div>;
  if (query.isError) {
    return <div>Gagal memuat agenda: {query.error instanceof Error ? query.error.message : "Error"}</div>;
  }
  if (!query.data) return <div>Agenda tidak ditemukan.</div>;

  const a = query.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Detail Agenda</h1>
        <p className="text-muted-foreground">#{a.id}</p>
      </div>

      <Card>
        <CardHeader className="space-y-2">
          <CardTitle>{a.judul}</CardTitle>
          <Badge variant="outline" className="w-fit">{a.kategori}</Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-1">
            <div className="text-sm text-muted-foreground">Waktu</div>
            <div className="font-medium">{new Date(a.tanggal).toLocaleDateString("id-ID")} | {a.waktuMulai} - {a.waktuSelesai}</div>
          </div>
          <div className="grid gap-1">
            <div className="text-sm text-muted-foreground">Lokasi</div>
            <div className="font-medium">{a.lokasi}</div>
          </div>
          <div className="grid gap-1">
            <div className="text-sm text-muted-foreground">Peserta</div>
            <div className="font-medium">{a.peserta} orang</div>
          </div>
          <div className="grid gap-1">
            <div className="text-sm text-muted-foreground">Deskripsi</div>
            <div className="whitespace-pre-wrap">{a.deskripsi}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

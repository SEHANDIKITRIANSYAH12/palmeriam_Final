import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { authFetch } from "@/lib/api";

type Berita = {
  id: number;
  judul: string;
  konten: string;
  kategori: string;
  gambar?: string | null;
  isPublished: boolean;
  createdAt: string;
};

export default function BeritaDetailAdminPage() {
  const { id } = useParams();
  const beritaId = Number(id);

  const query = useQuery({
    queryKey: ["admin-berita", beritaId],
    queryFn: () => authFetch<Berita>(`/api/berita/${beritaId}`),
    enabled: Number.isFinite(beritaId),
  });

  if (query.isLoading) return <div>Memuat...</div>;
  if (query.isError) {
    return <div>Gagal memuat berita: {query.error instanceof Error ? query.error.message : "Error"}</div>;
  }
  if (!query.data) return <div>Berita tidak ditemukan.</div>;

  const b = query.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Detail Berita</h1>
        <p className="text-muted-foreground">#{b.id}</p>
      </div>

      <Card>
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <CardTitle>{b.judul}</CardTitle>
            <Badge variant={b.isPublished ? "default" : "outline"}>{b.isPublished ? "Terbit" : "Draft"}</Badge>
          </div>
          <Badge variant="outline" className="w-fit">{b.kategori}</Badge>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-wrap">{b.konten}</div>
        </CardContent>
      </Card>
    </div>
  );
}

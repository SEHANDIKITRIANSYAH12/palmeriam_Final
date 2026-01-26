"use client";

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api';
import { Calendar, User, Tag, ChevronLeft, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

type NewsItem = {
  id: number;
  judul: string;
  konten: string;
  kategori: string;
  gambar?: string;
  isPublished: boolean;
  createdAt: string;
  penulis?: {
    name?: string;
    username?: string;
  };
};

const categoryColors: Record<string, string> = {
  "Kegiatan": "bg-primary/10 text-primary",
  "Pengumuman": "bg-accent/10 text-accent-dark",
  "Kesehatan": "bg-green-100 text-green-700",
};

export default function BeritaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: article, isLoading, error, isError } = useQuery({
    queryKey: ["public-berita", id],
    queryFn: async () => {
      const response = await apiFetch<NewsItem>(`/api/berita/${id}`);
      return response;
    },
    enabled: !!id,
    retry: 1,
  });

  if (isLoading) {
    return (
      <main className="pt-20 bg-background min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">Memuat berita...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isError || error || !article) {
    return (
      <main className="pt-20 bg-background min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold text-destructive">Berita Tidak Ditemukan</h2>
                <p className="text-muted-foreground">
                  {error instanceof Error ? error.message : 'Berita yang Anda cari tidak ditemukan atau telah dihapus.'}
                </p>
                <Button asChild variant="outline">
                  <Link href="/berita">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Kembali ke Berita
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Back Button */}
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/berita">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Kembali ke Berita
            </Link>
          </Button>

          {/* Article Card */}
          <Card className="overflow-hidden">
            {/* Image */}
            {article.gambar && (
              <div className="w-full h-[400px] md:h-[500px] overflow-hidden bg-muted relative">
                <Image
                  src={article.gambar}
                  alt={article.judul}
                  fill
                  sizes="100vw"
                  unoptimized
                  className="object-cover"
                />
              </div>
            )}

            <CardContent className="p-6 md:p-8 space-y-6">
              {/* Category Badge */}
              <div className="flex items-center gap-2">
                <Badge className={categoryColors[article.kategori] || 'bg-secondary'}>
                  <Tag className="mr-1 h-3 w-3" />
                  {article.kategori}
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                {article.judul}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b pb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(article.createdAt), 'EEEE, d MMMM yyyy', { locale: idLocale })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {format(new Date(article.createdAt), 'HH:mm')} WIB
                  </span>
                </div>
                {article.penulis?.name && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{article.penulis.name}</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                <div className="text-foreground leading-relaxed space-y-4 text-base">
                  {article.konten.split('\n').map((paragraph, idx) => 
                    paragraph.trim() ? (
                      <p key={idx} className="mb-4">{paragraph}</p>
                    ) : null
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related News or Back Button */}
          <div className="flex justify-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/berita">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Lihat Berita Lainnya
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

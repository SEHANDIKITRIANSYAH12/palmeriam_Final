"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Users, Calendar, ChevronRight, MapPin, Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

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

type AgendaItem = {
  id: number;
  judul: string;
  deskripsi: string;
  tanggal: string;
  waktuMulai: string;
  waktuSelesai: string;
  lokasi: string;
  kategori: string;
  peserta: number;
  createdAt: string;
  updatedAt: string;
};

const categoryColors: Record<string, string> = {
  "Kegiatan": "bg-primary/10 text-primary",
  "Pengumuman": "bg-accent/10 text-accent-dark",
  "Kesehatan": "bg-green-100 text-green-700",
};

const agendaCategoryColors: Record<string, string> = {
  "Rutin": "bg-blue-100 text-blue-700",
  "Khusus": "bg-purple-100 text-purple-700",
  "Darurat": "bg-red-100 text-red-700",
};

export default function BeritaPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: newsData = [], isLoading, error } = useQuery({
    queryKey: ["public-berita"],
    queryFn: () => apiFetch<NewsItem[]>("/api/berita"),
  });

  const { data: agendaData = [], isLoading: agendaLoading, error: agendaError } = useQuery({
    queryKey: ["public-agenda"],
    queryFn: () => apiFetch<AgendaItem[]>("/api/agenda"),
  });

  const filteredNews = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return newsData;
    return newsData.filter(
      (item) =>
        item.judul.toLowerCase().includes(q) ||
        item.konten.toLowerCase().includes(q) ||
        item.kategori.toLowerCase().includes(q)
    );
  }, [newsData, searchQuery]);

  const featuredNews = filteredNews[0];
  const otherNews = filteredNews.slice(1);

  return (
    <main id="main-content" className="pt-20 bg-background">
      <section className="bg-primary py-16 md:py-20">
        <div className="container-government">
          <div className="max-w-2xl">
            <div className="accent-line mb-4" />
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Berita & Agenda
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              Informasi terkini mengenai kegiatan, pengumuman, dan agenda Kelurahan Palmeriam.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-government">
          <Tabs defaultValue="berita" className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <TabsList className="grid w-full sm:w-auto grid-cols-2">
                <TabsTrigger value="berita" className="gap-2"><Bell className="w-4 h-4" />Berita</TabsTrigger>
                <TabsTrigger value="agenda" className="gap-2"><Calendar className="w-4 h-4" />Agenda</TabsTrigger>
              </TabsList>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Cari berita..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <TabsContent value="berita">
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Memuat berita...</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600">Gagal memuat berita.</p>
                </div>
              ) : filteredNews.length > 0 ? (
                <div className="grid grid-cols-1 gap-8">
                  {/* Featured News */}
                  <Link href={`/berita/${featuredNews.id}`} className="card-government group block overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-2/5 h-56 md:h-auto overflow-hidden relative">
                        <Image
                          src={featuredNews.gambar || "/placeholder.svg"}
                          alt={featuredNews.judul}
                          fill
                          priority
                          sizes="(min-width: 768px) 40vw, 100vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-6 md:p-8 md:w-3/5 flex flex-col">
                        <Badge className={categoryColors[featuredNews.kategori] || 'bg-secondary'}>
                          {featuredNews.kategori}
                        </Badge>
                        <h2 className="font-heading text-xl lg:text-2xl font-semibold text-foreground mt-3 mb-2 group-hover:text-primary transition-colors">
                          {featuredNews.judul}
                        </h2>
                        <p className="text-muted-foreground mb-4 flex-grow">
                          {featuredNews.konten.slice(0, 150)}...
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-auto">
                          <Calendar className="w-4 h-4" />
                          <span>{format(new Date(featuredNews.createdAt), 'd MMMM yyyy', { locale: id })}</span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Other News */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {otherNews.map((item) => (
                      <Link href={`/berita/${item.id}`} key={item.id} className="card-government group flex flex-col overflow-hidden">
                        <div className="h-40 overflow-hidden relative">
                          <Image
                            src={item.gambar || "/placeholder.svg"}
                            alt={item.judul}
                            fill
                            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4 flex flex-col flex-grow">
                           <Badge className={categoryColors[item.kategori] || 'bg-secondary'}>
                             {item.kategori}
                           </Badge>
                          <h3 className="font-heading font-semibold text-foreground mt-2 mb-2 line-clamp-2 group-hover:text-primary transition-colors flex-grow">
                            {item.judul}
                          </h3>
                          <div className="flex items-center justify-between mt-auto pt-2">
                            <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {format(new Date(item.createdAt), 'd MMM yyyy', { locale: id })}
                            </span>
                            <span className="text-sm text-primary font-medium flex items-center gap-1">
                              Baca
                              <ChevronRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">Tidak ada berita yang cocok dengan pencarian Anda.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="agenda">
              {agendaLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Memuat agenda...</p>
                </div>
              ) : agendaError ? (
                <div className="text-center py-12">
                  <p className="text-red-600">Gagal memuat agenda.</p>
                </div>
              ) : agendaData.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {agendaData.map((item) => (
                    <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 transform cursor-pointer group">
                      {/* Date Header */}
                      <div className="bg-primary p-4 text-center group-hover:bg-primary-light transition-colors duration-300">
                        <div className="text-3xl font-bold text-accent group-hover:text-accent-light transition-colors duration-300">
                          {format(new Date(item.tanggal), 'd')}
                        </div>
                        <div className="text-sm text-accent/90 group-hover:text-accent-light transition-colors duration-300">
                          {format(new Date(item.tanggal), 'MMMM yyyy', { locale: id })}
                        </div>
                        <div className="text-xs text-accent/80 mt-1 group-hover:text-accent-light transition-colors duration-300">
                          {item.waktuMulai} - {item.waktuSelesai} WIB
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="p-6">
                        <h3 className="font-heading text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
                          {item.judul}
                        </h3>
                        
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors duration-300">
                            <MapPin className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-sm">{item.lokasi}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors duration-300">
                            <Users className="w-4 h-4 text-primary group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-sm">{item.peserta} peserta</span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <Badge className={`${agendaCategoryColors[item.kategori] || 'bg-accent/10 text-accent-dark'} group-hover:scale-105 transition-transform duration-300`}>
                            {item.kategori}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">Belum ada agenda yang terjadwal.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
}

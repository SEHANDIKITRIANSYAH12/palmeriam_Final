import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  Tag,
  Search,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image?: string;
}

interface AgendaItem {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  type: "meeting" | "event" | "service";
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    title: "Pembagian Bantuan Sosial Tahap II Tahun 2025",
    excerpt: "Kelurahan Palmeriam akan menyalurkan bantuan sosial tahap kedua kepada warga yang terdaftar sebagai penerima manfaat.",
    date: "3 Januari 2025",
    category: "Pengumuman",
  },
  {
    id: 2,
    title: "Gotong Royong Bersih Lingkungan di RT 05",
    excerpt: "Kegiatan gotong royong rutin bulanan berhasil dilaksanakan dengan partisipasi aktif warga RT 05 RW 02.",
    date: "2 Januari 2025",
    category: "Kegiatan",
  },
  {
    id: 3,
    title: "Sosialisasi Program KB Nasional",
    excerpt: "Puskesmas bekerja sama dengan kelurahan mengadakan sosialisasi program Keluarga Berencana untuk masyarakat.",
    date: "30 Desember 2024",
    category: "Kesehatan",
  },
  {
    id: 4,
    title: "Peningkatan Layanan Digital SIIPALMI",
    excerpt: "Sistem informasi pelayanan kelurahan telah ditingkatkan dengan fitur-fitur baru untuk kemudahan akses masyarakat.",
    date: "28 Desember 2024",
    category: "Teknologi",
  },
  {
    id: 5,
    title: "Pelatihan UMKM Digital Marketing",
    excerpt: "Kelurahan mengadakan pelatihan pemasaran digital untuk pelaku UMKM di wilayah Palmeriam.",
    date: "25 Desember 2024",
    category: "Ekonomi",
  },
];

const agendaItems: AgendaItem[] = [
  {
    id: 1,
    title: "Rapat Koordinasi Perangkat Kelurahan",
    date: "6 Januari 2025",
    time: "09:00 - 11:00 WIB",
    location: "Aula Kelurahan",
    type: "meeting",
  },
  {
    id: 2,
    title: "Posyandu Balita RW 01-03",
    date: "7 Januari 2025",
    time: "08:00 - 12:00 WIB",
    location: "Balai RW 02",
    type: "service",
  },
  {
    id: 3,
    title: "Musyawarah Perencanaan Pembangunan",
    date: "10 Januari 2025",
    time: "13:00 - 16:00 WIB",
    location: "Aula Kelurahan",
    type: "meeting",
  },
  {
    id: 4,
    title: "Senam Sehat Bersama Warga",
    date: "12 Januari 2025",
    time: "06:00 - 08:00 WIB",
    location: "Lapangan Kelurahan",
    type: "event",
  },
  {
    id: 5,
    title: "Vaksinasi COVID-19 Booster",
    date: "15 Januari 2025",
    time: "08:00 - 14:00 WIB",
    location: "Puskesmas Palmeriam",
    type: "service",
  },
];

const categoryColors: Record<string, string> = {
  Pengumuman: "bg-destructive/10 text-destructive",
  Kegiatan: "bg-primary/10 text-primary",
  Kesehatan: "bg-green-100 text-green-700",
  Teknologi: "bg-blue-100 text-blue-700",
  Ekonomi: "bg-accent/10 text-accent-dark",
};

const typeColors: Record<string, string> = {
  meeting: "bg-primary/10 text-primary",
  event: "bg-accent/10 text-accent-dark",
  service: "bg-green-100 text-green-700",
};

const typeLabels: Record<string, string> = {
  meeting: "Rapat",
  event: "Acara",
  service: "Layanan",
};

export default function BeritaPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNews = newsItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main id="main-content" className="pt-20">
      {/* Hero */}
      <section className="bg-primary py-16 md:py-20">
        <div className="container-government">
          <div className="max-w-2xl">
            <div className="accent-line mb-4" />
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Berita & Agenda
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              Informasi terkini mengenai kegiatan, pengumuman, dan agenda 
              Kelurahan Palmeriam.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-background">
        <div className="container-government">
          <Tabs defaultValue="berita" className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <TabsList className="grid w-full sm:w-auto grid-cols-2">
                <TabsTrigger value="berita" className="gap-2">
                  <Bell className="w-4 h-4" />
                  Berita
                </TabsTrigger>
                <TabsTrigger value="agenda" className="gap-2">
                  <Calendar className="w-4 h-4" />
                  Agenda
                </TabsTrigger>
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

            {/* News Tab */}
            <TabsContent value="berita" className="space-y-6">
              {filteredNews.length > 0 ? (
                <div className="grid gap-6">
                  {/* Featured News */}
                  <div className="card-government overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-2/5 h-48 md:h-auto bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                        <Bell className="w-16 h-16 text-primary-foreground/30" />
                      </div>
                      <div className="p-6 md:w-3/5">
                        <Badge className={categoryColors[filteredNews[0].category]}>
                          {filteredNews[0].category}
                        </Badge>
                        <h2 className="font-heading text-xl font-semibold text-foreground mt-3 mb-2">
                          {filteredNews[0].title}
                        </h2>
                        <p className="text-muted-foreground mb-4">
                          {filteredNews[0].excerpt}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{filteredNews[0].date}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Other News */}
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredNews.slice(1).map((item) => (
                      <article key={item.id} className="card-service">
                        <div className="h-32 bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
                          <Tag className="w-10 h-10 text-muted-foreground/50" />
                        </div>
                        <div className="p-4">
                          <Badge className={categoryColors[item.category]} variant="secondary">
                            {item.category}
                          </Badge>
                          <h3 className="font-heading font-semibold text-foreground mt-2 mb-2 line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {item.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {item.date}
                            </span>
                            <button className="text-sm text-primary font-medium flex items-center gap-1 hover:text-primary-light transition-colors">
                              Baca
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Tidak ada berita yang cocok dengan pencarian Anda.
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Agenda Tab */}
            <TabsContent value="agenda" className="space-y-4">
              {agendaItems.map((item) => (
                <div
                  key={item.id}
                  className="card-government p-4 flex flex-col sm:flex-row sm:items-center gap-4"
                >
                  {/* Date Box */}
                  <div className="w-20 h-20 rounded-xl bg-primary flex flex-col items-center justify-center text-primary-foreground shrink-0">
                    <span className="text-2xl font-bold">
                      {item.date.split(" ")[0]}
                    </span>
                    <span className="text-xs uppercase">
                      {item.date.split(" ")[1].slice(0, 3)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Badge className={typeColors[item.type]} variant="secondary">
                        {typeLabels[item.type]}
                      </Badge>
                    </div>
                    <h3 className="font-heading font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {item.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {item.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="text-center pt-4">
                <Button variant="outline">Lihat Semua Agenda</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
}

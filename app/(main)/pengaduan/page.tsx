"use client";

import { useState, FormEvent, type ElementType } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { QRCodeSVG } from "qrcode.react";
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { 
  MessageSquare, Send, CheckCircle2, AlertCircle, Phone, Mail, MapPin, Clock, Download, QrCode, Copy, Search, FileClock, ThumbsUp, Wrench
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

const formSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit"),
  email: z.string().email("Email tidak valid").optional().or(z.literal("")),
  category: z.string().min(1, "Pilih kategori pengaduan"),
  subject: z.string().min(5, "Subjek minimal 5 karakter"),
  message: z.string().min(20, "Isi pengaduan minimal 20 karakter"),
});

type FormData = z.infer<typeof formSchema>;

const categories = [
  { value: "layanan", label: "Layanan Administrasi" },
  { value: "infrastruktur", label: "Infrastruktur & Fasilitas" },
  { value: "keamanan", label: "Keamanan & Ketertiban" },
  { value: "kebersihan", label: "Kebersihan Lingkungan" },
  { value: "sosial", label: "Masalah Sosial" },
  { value: "lainnya", label: "Lainnya" },
];

type PengaduanResponse = {
  id: number;
  ticketId: string;
  judul: string;
  deskripsi: string;
  status: string;
  prioritas: string;
  pelaporNama: string;
  pelaporKontak: string | null;
  pelaporEmail: string | null;
  lokasi: string | null;
  kategori: string;
  createdAt: string;
  updatedAt: string;
};

export default function PengaduanPage() {
  const [activeTab, setActiveTab] = useState("buat");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState("");
  const [showQR, setShowQR] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({ resolver: zodResolver(formSchema), defaultValues: { name: "", phone: "", email: "", category: "", subject: "", message: "" } });

  // Mutation untuk create pengaduan
  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const payload = {
        judul: data.subject,
        deskripsi: data.message,
        kategori: data.category,
        pelaporNama: data.name,
        pelaporKontak: data.phone,
        pelaporEmail: data.email || undefined,
        lokasi: undefined,
      };
      return apiFetch<PengaduanResponse>("/api/pengaduan", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
    onSuccess: (data) => {
      setSubmittedTicketId(data.ticketId);
      setIsSubmitted(true);
      form.reset();
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
        const savedTickets = JSON.parse(localStorage.getItem('pengaduan_tickets') || '[]');
        savedTickets.push(data.ticketId);
        localStorage.setItem('pengaduan_tickets', JSON.stringify(savedTickets));
      }
      toast({ 
        title: "Pengaduan Terkirim!", 
        description: `Nomor tiket Anda adalah ${data.ticketId}. Silakan simpan untuk melacak status.` 
      });
    },
    onError: (err) => {
      toast({
        title: "Gagal mengirim pengaduan",
        description: err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim pengaduan",
        variant: "destructive",
      });
    },
  });

  // Query untuk tracking pengaduan
  const trackingQuery = useQuery({
    queryKey: ["track-pengaduan", trackingId],
    queryFn: () => apiFetch<PengaduanResponse>(`/api/pengaduan/track/${trackingId}`),
    enabled: false,
    retry: false,
  });

  const onSubmit = (data: FormData) => {
    createMutation.mutate(data);
  };

  const handleTrackComplaint = (e: FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) {
      toast({
        title: "Nomor tiket kosong",
        description: "Masukkan nomor tiket untuk melacak pengaduan",
        variant: "destructive",
      });
      return;
    }
    trackingQuery.refetch();
  };

  const handleNewSubmission = () => {
    setIsSubmitted(false);
    setSubmittedTicketId(null);
  }

  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <main id="main-content" className="pt-20">
      {/* Hero */}
      <section className="bg-primary py-16 md:py-20">
        <div className="container-government">
          <div className="max-w-2xl">
            <div className="accent-line mb-4" />
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Pengaduan Masyarakat
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              Sampaikan keluhan, saran, atau aspirasi Anda. Kami berkomitmen untuk 
              mendengarkan dan menindaklanjuti setiap pengaduan dengan transparan.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-background">
        <div className="container-government">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full sm:w-auto grid-cols-2">
                  <TabsTrigger value="buat">Buat Pengaduan</TabsTrigger>
                  <TabsTrigger value="lacak">Lacak Pengaduan</TabsTrigger>
                </TabsList>
                <TabsContent value="buat">
            {isSubmitted && submittedTicketId ? (
                <div className="card-government p-8 text-center mt-8">
                  <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                  <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">Pengaduan Berhasil Dikirim!</h2>
                  <p className="text-muted-foreground mb-4">Terima kasih, pengaduan Anda telah kami terima. Silakan simpan nomor tiket Anda untuk melacak status pengaduan.</p>
                  <div className="bg-secondary/50 border-2 border-dashed border-secondary-foreground/20 rounded-lg p-4 inline-flex flex-col items-center gap-2 mb-6">
                    <p className="text-sm text-muted-foreground">Nomor Tiket Anda:</p>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-lg font-bold text-foreground">{submittedTicketId}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { navigator.clipboard.writeText(submittedTicketId); toast({ title: "Nomor tiket disalin!" }); }}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button onClick={handleNewSubmission}>Kirim Pengaduan Lain</Button>
                    <Button variant="outline" onClick={() => { setTrackingId(submittedTicketId); setActiveTab("lacak"); }}>Lacak Status</Button>
                  </div>
                </div>
              ) : (
                <div className="card-government p-6 md:p-8 mt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <MessageSquare className="w-5 h-5 text-primary mr-2" />
                    <h2 className="font-heading text-xl font-semibold text-foreground">Form Pengaduan</h2>
                  </div>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Nama Lengkap *</FormLabel><FormControl><Input placeholder="Masukkan nama lengkap" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Nomor Telepon *</FormLabel><FormControl><Input placeholder="08xxxxxxxxxx" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email (opsional)</FormLabel><FormControl><Input placeholder="email@contoh.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="category" render={({ field }) => (<FormItem><FormLabel>Kategori Pengaduan *</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Pilih kategori" /></SelectTrigger></FormControl><SelectContent>{categories.map((cat) => (<SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
                      </div>
                      <FormField control={form.control} name="subject" render={({ field }) => (<FormItem><FormLabel>Subjek Pengaduan *</FormLabel><FormControl><Input placeholder="Ringkasan pengaduan Anda" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={form.control} name="message" render={({ field }) => (<FormItem><FormLabel>Isi Pengaduan *</FormLabel><FormControl><Textarea placeholder="Jelaskan pengaduan Anda secara detail..." className="min-h-[150px] resize-none" {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <div className="bg-secondary/50 rounded-lg p-4 flex items-start gap-3"><AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" /><p className="text-sm text-muted-foreground">Data yang Anda berikan akan dijaga kerahasiaannya.</p></div>
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full sm:w-auto"
                        disabled={createMutation.isPending}
                      >
                        {createMutation.isPending ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Mengirim...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Kirim Pengaduan
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </div>
              )}
                </TabsContent>
                <TabsContent value="lacak">
              <div className="card-government p-6 md:p-8 mt-8">
                <div className="flex items-center gap-3 mb-6">
                  <Search className="w-5 h-5 text-primary mr-2" />
                  <h2 className="font-heading text-xl font-semibold text-foreground">Lacak Status Pengaduan</h2>
                </div>
                <form onSubmit={handleTrackComplaint} className="flex items-start gap-2">
                  <Input 
                    placeholder="Masukkan nomor tiket Anda..."
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    className="flex-grow"
                    aria-label="Nomor Tiket"
                  />
                  <Button 
                    type="submit" 
                    disabled={!trackingId || trackingQuery.isLoading}
                  >
                    {trackingQuery.isLoading ? "Mencari..." : "Lacak"}
                  </Button>
                </form>

                {trackingQuery.isError && (
                  <div className="mt-4 flex items-start gap-2 text-sm text-destructive">
                    <AlertCircle className="w-4 h-4 mt-0.5" />
                    <p>
                      {trackingQuery.error instanceof Error 
                        ? trackingQuery.error.message 
                        : `Tiket dengan nomor "${trackingId}" tidak ditemukan.`}
                    </p>
                  </div>
                )}

                {trackingQuery.isLoading && (
                  <div className="mt-4 text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-sm text-muted-foreground mt-2">Mencari pengaduan...</p>
                  </div>
                )}

                {trackingQuery.data && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-4">
                      Hasil Pelacakan
                    </h3>

                    <div className="space-y-3 text-sm">
                      <div className="bg-secondary/50 rounded-lg p-4">
                        <p className="text-muted-foreground mb-1">Nomor Tiket</p>
                        <p className="font-mono text-lg font-bold text-foreground">{trackingQuery.data.ticketId}</p>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground mb-1">Subjek</p>
                        <p className="text-foreground font-medium">{trackingQuery.data.judul}</p>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground mb-1">Kategori</p>
                        <p className="text-foreground">{trackingQuery.data.kategori}</p>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground mb-1">Tanggal Masuk</p>
                        <p className="text-foreground">
                          {format(new Date(trackingQuery.data.createdAt), "d MMMM yyyy, HH:mm", { locale: idLocale })} WIB
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-muted-foreground mb-1">Status Terkini</p>
                        <div className="flex items-center gap-2">
                          {(() => {
                            const statusMap: Record<string, { icon: ElementType; color: string }> = {
                              "Baru": { icon: CheckCircle2, color: 'text-blue-500' },
                              "Diproses": { icon: Wrench, color: 'text-orange-500' },
                              "Selesai": { icon: ThumbsUp, color: 'text-green-500' },
                            };
                            const config = statusMap[trackingQuery.data.status] || { icon: AlertCircle, color: 'text-muted-foreground' };
                            const Icon = config.icon;
                            return (
                              <>
                                <Icon className={`w-4 h-4 ${config.color}`} />
                                <span className={`font-medium ${config.color}`}>{trackingQuery.data.status}</span>
                              </>
                            );
                          })()}
                        </div>
                      </div>

                      {trackingQuery.data.prioritas && (
                        <div>
                          <p className="text-muted-foreground mb-1">Prioritas</p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            trackingQuery.data.prioritas === 'Tinggi' ? 'bg-red-100 text-red-800' :
                            trackingQuery.data.prioritas === 'Sedang' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {trackingQuery.data.prioritas}
                          </span>
                        </div>
                      )}

                      {trackingQuery.data.deskripsi && (
                        <div>
                          <p className="text-muted-foreground mb-1">Deskripsi</p>
                          <p className="text-foreground whitespace-pre-wrap">{trackingQuery.data.deskripsi}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* QR Code Card */}
              <div className="card-government p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <QrCode className="w-5 h-5 text-primary" />
                  <h3 className="font-heading font-semibold text-foreground">
                    Scan QR Code
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Scan untuk akses cepat ke halaman pengaduan dari perangkat mobile
                </p>
                <div className="bg-secondary p-4 rounded-xl inline-block">
                  <QRCodeSVG
                    value={submittedTicketId ? `${currentUrl}?track=${submittedTicketId}` : currentUrl}
                    size={160}
                    level="M"
                    includeMargin={false}
                  />
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4 w-full"
                  onClick={() => setShowQR(!showQR)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Unduh QR Code
                </Button>
                {showQR && (
                  <p className="text-xs text-muted-foreground mt-3">
                    Tips: Klik kanan QR Code lalu pilih "Save Image" untuk menyimpan.
                  </p>
                )}
              </div>

              {/* Contact Info */}
              <div className="card-government p-6">
                <h3 className="font-heading font-semibold text-foreground mb-4">
                  Kontak Langsung
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Telepon</p>
                      <p className="text-sm text-muted-foreground">(021) 1234-5678</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Email</p>
                      <p className="text-sm text-muted-foreground">kelurahan.palmeriam@jakarta.go.id</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Alamat</p>
                      <p className="text-sm text-muted-foreground">
                        Jl. Palmeriam No. 1, Jakarta Timur
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Jam Operasional</p>
                      <p className="text-sm text-muted-foreground">
                        Senin - Jumat, 08:00 - 16:00 WIB
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Response Time */}
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
                <p className="text-sm text-foreground">
                  <strong>Waktu Respon:</strong> Pengaduan Anda akan ditindaklanjuti 
                  dalam waktu maksimal 1x24 jam kerja.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

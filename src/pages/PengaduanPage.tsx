import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { QRCodeSVG } from "qrcode.react";
import { 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Download,
  QrCode
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

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

export default function PengaduanPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      category: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
    setIsSubmitted(true);
    toast({
      title: "Pengaduan Terkirim!",
      description: "Terima kasih, pengaduan Anda akan segera kami proses.",
    });
  };

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
            {/* Form Section */}
            <div className="lg:col-span-2">
              {isSubmitted ? (
                <div className="card-government p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-green-100 mx-auto mb-4 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">
                    Pengaduan Berhasil Dikirim!
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Terima kasih telah menyampaikan pengaduan Anda. Tim kami akan 
                    menindaklanjuti dalam waktu 1x24 jam.
                  </p>
                  <Button onClick={() => setIsSubmitted(false)}>
                    Kirim Pengaduan Lain
                  </Button>
                </div>
              ) : (
                <div className="card-government p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-heading text-xl font-semibold text-foreground">
                        Form Pengaduan
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Isi formulir di bawah dengan lengkap
                      </p>
                    </div>
                  </div>

                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nama Lengkap *</FormLabel>
                              <FormControl>
                                <Input placeholder="Masukkan nama lengkap" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nomor Telepon *</FormLabel>
                              <FormControl>
                                <Input placeholder="08xxxxxxxxxx" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email (opsional)</FormLabel>
                              <FormControl>
                                <Input placeholder="email@contoh.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Kategori Pengaduan *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Pilih kategori" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                      {cat.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subjek Pengaduan *</FormLabel>
                            <FormControl>
                              <Input placeholder="Ringkasan pengaduan Anda" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Isi Pengaduan *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Jelaskan pengaduan Anda secara detail..."
                                className="min-h-[150px] resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="bg-secondary/50 rounded-lg p-4 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                        <p className="text-sm text-muted-foreground">
                          Data yang Anda berikan akan dijaga kerahasiaannya dan hanya 
                          digunakan untuk keperluan tindak lanjut pengaduan.
                        </p>
                      </div>

                      <Button type="submit" size="lg" className="w-full sm:w-auto">
                        <Send className="w-4 h-4 mr-2" />
                        Kirim Pengaduan
                      </Button>
                    </form>
                  </Form>
                </div>
              )}
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
                    value={currentUrl}
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

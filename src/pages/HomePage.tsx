import { Link } from "react-router-dom";
import { 
  FileText, 
  Users, 
  Calendar, 
  MessageSquare, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Clock, 
  Phone,
  ChevronRight,
  Award,
  Heart,
  Target,
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-kelurahan.jpg";

// Team members data
const teamMembers = [
  { 
    name: "Budi Santoso, S.Sos", 
    role: "Lurah", 
    description: "Memimpin dan mengkoordinasikan seluruh kegiatan kelurahan"
  },
  { 
    name: "Siti Rahayu, S.AP", 
    role: "Sekretaris Kelurahan", 
    description: "Mengelola administrasi dan tata usaha kelurahan"
  },
  { 
    name: "Ahmad Hidayat, S.E", 
    role: "Kasi Pemerintahan", 
    description: "Menangani urusan pemerintahan dan pelayanan umum"
  },
  { 
    name: "Dewi Lestari, S.Sos", 
    role: "Kasi Kesejahteraan", 
    description: "Mengelola program kesejahteraan masyarakat"
  },
];

// Services data
const services = [
  {
    icon: FileText,
    title: "Surat Domisili",
    description: "Surat keterangan tempat tinggal untuk berbagai keperluan administratif",
  },
  {
    icon: Briefcase,
    title: "Surat Keterangan Usaha",
    description: "Dokumen pendukung untuk legalitas usaha mikro dan kecil",
  },
  {
    icon: Users,
    title: "Surat Pengantar RT/RW",
    description: "Pengantar resmi untuk berbagai keperluan administrasi",
  },
  {
    icon: Award,
    title: "Legalisir Dokumen",
    description: "Pengesahan dokumen resmi untuk keperluan administratif",
  },
];

// Stats data
const stats = [
  { value: "50,000+", label: "Warga Terlayani" },
  { value: "15,000+", label: "Dokumen/Tahun" },
  { value: "24 Jam", label: "Respon Pengaduan" },
  { value: "98%", label: "Kepuasan Warga" },
];

export default function HomePage() {
  return (
    <main id="main-content" className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Kantor Kelurahan Palmeriam"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/80 to-primary/40" />
        </div>

        {/* Content */}
        <div className="container-government relative z-10 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent mb-6 animate-fade-in">
              <Building2 className="w-4 h-4" />
              <span className="text-sm font-medium">Portal Resmi Kelurahan Palmeriam</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 animate-slide-up opacity-0 stagger-1">
              SIIPALMI
            </h1>
            
            <p className="text-xl sm:text-2xl text-primary-foreground/90 mb-4 animate-slide-up opacity-0 stagger-2">
              Sistem Informasi Pelayanan Kelurahan Palmeriam
            </p>

            <p className="text-primary-foreground/80 text-lg mb-8 animate-slide-up opacity-0 stagger-3">
              Melayani masyarakat dengan sepenuh hati. Akses layanan administrasi, 
              informasi, dan pengaduan dalam satu platform terintegrasi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up opacity-0 stagger-4">
              <Button size="lg" className="btn-gold text-base" asChild>
                <Link to="/layanan">
                  Lihat Layanan
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent text-base"
                asChild
              >
                <Link to="/pengaduan">
                  Ajukan Pengaduan
                </Link>
              </Button>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-6 mt-10 pt-10 border-t border-primary-foreground/20 animate-slide-up opacity-0 stagger-5">
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Clock className="w-5 h-5 text-accent" />
                <span className="text-sm">Senin - Jumat, 08:00 - 16:00</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Phone className="w-5 h-5 text-accent" />
                <span className="text-sm">(021) 1234-5678</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary py-8">
        <div className="container-government">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="font-heading text-3xl sm:text-4xl font-bold text-accent mb-1">
                  {stat.value}
                </p>
                <p className="text-primary-foreground/80 text-sm">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section-padding bg-background">
        <div className="container-government">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="accent-line mb-4" />
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Tentang Kelurahan Palmeriam
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Kelurahan Palmeriam merupakan salah satu kelurahan di Kecamatan Matraman, 
                Jakarta Timur. Kami berkomitmen untuk memberikan pelayanan terbaik kepada 
                masyarakat dengan mengedepankan prinsip transparansi, akuntabilitas, dan 
                profesionalisme.
              </p>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Melalui platform SIIPALMI, kami mempermudah akses masyarakat terhadap 
                berbagai layanan administratif, informasi kegiatan, dan saluran pengaduan 
                yang responsif.
              </p>
              
              <div className="space-y-3">
                {[
                  "Pelayanan cepat dan transparan",
                  "Sistem pengaduan 24 jam",
                  "Akses informasi real-time",
                  "Ramah aksesibilitas",
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-accent shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="card-government p-6 text-center">
                <Target className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-heading font-semibold text-foreground mb-2">Visi</h3>
                <p className="text-sm text-muted-foreground">
                  Mewujudkan Kelurahan Palmeriam yang modern, transparan, dan melayani
                </p>
              </div>
              <div className="card-government p-6 text-center mt-8">
                <Heart className="w-10 h-10 text-accent mx-auto mb-3" />
                <h3 className="font-heading font-semibold text-foreground mb-2">Misi</h3>
                <p className="text-sm text-muted-foreground">
                  Meningkatkan kualitas pelayanan publik berbasis teknologi
                </p>
              </div>
              <div className="card-government p-6 text-center">
                <Users className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-heading font-semibold text-foreground mb-2">Partisipatif</h3>
                <p className="text-sm text-muted-foreground">
                  Mendorong partisipasi aktif masyarakat dalam pembangunan
                </p>
              </div>
              <div className="card-government p-6 text-center mt-8">
                <Award className="w-10 h-10 text-accent mx-auto mb-3" />
                <h3 className="font-heading font-semibold text-foreground mb-2">Integritas</h3>
                <p className="text-sm text-muted-foreground">
                  Menjunjung tinggi kejujuran dan profesionalisme
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-secondary">
        <div className="container-government">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="accent-line mx-auto mb-4" />
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Layanan Kelurahan
            </h2>
            <p className="text-muted-foreground">
              Berbagai layanan administratif yang kami sediakan untuk memenuhi kebutuhan masyarakat
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div key={index} className="card-service group">
                <div className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <service.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {service.description}
                  </p>
                  <Link 
                    to="/layanan" 
                    className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-light transition-colors"
                  >
                    Selengkapnya
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button size="lg" asChild>
              <Link to="/layanan">
                Lihat Semua Layanan
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-background">
        <div className="container-government">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="accent-line mx-auto mb-4" />
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Struktur Organisasi
            </h2>
            <p className="text-muted-foreground">
              Perangkat kelurahan yang siap melayani kebutuhan masyarakat
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <div key={index} className="card-government text-center group">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-light mx-auto mb-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Users className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="font-heading font-semibold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-accent mb-2">
                  {member.role}
                </p>
                <p className="text-sm text-muted-foreground">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary">
        <div className="container-government">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-primary-foreground mb-2">
                Ada Keluhan atau Pengaduan?
              </h2>
              <p className="text-primary-foreground/80">
                Sampaikan aspirasi Anda melalui sistem pengaduan online kami. 
                Kami siap mendengarkan dan menindaklanjuti.
              </p>
            </div>
            <Button size="lg" className="btn-gold whitespace-nowrap" asChild>
              <Link to="/pengaduan">
                <MessageSquare className="w-5 h-5 mr-2" />
                Ajukan Pengaduan
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

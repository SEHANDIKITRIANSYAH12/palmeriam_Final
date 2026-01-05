import { useState } from "react";
import { 
  FileText, 
  Briefcase, 
  Users, 
  Award, 
  ClipboardList, 
  Home,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  FileCheck,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ServiceRequirement {
  item: string;
}

interface ServiceStep {
  step: number;
  description: string;
}

interface Service {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  duration: string;
  requirements: ServiceRequirement[];
  steps: ServiceStep[];
}

const services: Service[] = [
  {
    id: "domisili",
    icon: Home,
    title: "Surat Keterangan Domisili",
    description: "Surat keterangan tempat tinggal untuk berbagai keperluan administratif seperti pekerjaan, pendidikan, dan lainnya.",
    duration: "1-2 hari kerja",
    requirements: [
      { item: "Fotokopi KTP" },
      { item: "Fotokopi Kartu Keluarga" },
      { item: "Surat Pengantar RT/RW" },
      { item: "Pas foto 3x4 (2 lembar)" },
      { item: "Fotokopi bukti kepemilikan/sewa tempat tinggal" },
    ],
    steps: [
      { step: 1, description: "Siapkan dokumen persyaratan yang diperlukan" },
      { step: 2, description: "Dapatkan Surat Pengantar dari RT dan RW setempat" },
      { step: 3, description: "Datang ke kantor kelurahan pada jam pelayanan" },
      { step: 4, description: "Serahkan berkas ke loket pelayanan" },
      { step: 5, description: "Tunggu proses verifikasi (1-2 hari kerja)" },
      { step: 6, description: "Ambil surat yang sudah jadi di loket" },
    ],
  },
  {
    id: "usaha",
    icon: Briefcase,
    title: "Surat Keterangan Usaha",
    description: "Dokumen pendukung untuk legalitas usaha mikro dan kecil yang berdomisili di wilayah Kelurahan Palmeriam.",
    duration: "2-3 hari kerja",
    requirements: [
      { item: "Fotokopi KTP pemilik usaha" },
      { item: "Fotokopi Kartu Keluarga" },
      { item: "Surat Pengantar RT/RW" },
      { item: "Pas foto 3x4 (2 lembar)" },
      { item: "Foto lokasi usaha" },
      { item: "Surat pernyataan tidak keberatan dari tetangga" },
    ],
    steps: [
      { step: 1, description: "Siapkan dokumen persyaratan yang diperlukan" },
      { step: 2, description: "Minta Surat Pengantar dari RT dan RW" },
      { step: 3, description: "Datang ke kantor kelurahan dengan berkas lengkap" },
      { step: 4, description: "Isi formulir permohonan SKU" },
      { step: 5, description: "Tunggu verifikasi dan survei lokasi jika diperlukan" },
      { step: 6, description: "Ambil SKU yang sudah ditandatangani" },
    ],
  },
  {
    id: "pengantar",
    icon: FileText,
    title: "Surat Pengantar RT/RW",
    description: "Surat pengantar resmi dari tingkat RT/RW untuk berbagai keperluan administratif di kelurahan.",
    duration: "1 hari kerja",
    requirements: [
      { item: "KTP asli" },
      { item: "Kartu Keluarga asli" },
      { item: "Dokumen pendukung sesuai keperluan" },
    ],
    steps: [
      { step: 1, description: "Hubungi ketua RT/RW setempat" },
      { step: 2, description: "Jelaskan keperluan surat pengantar" },
      { step: 3, description: "Serahkan dokumen yang diperlukan" },
      { step: 4, description: "Tunggu proses pembuatan surat" },
      { step: 5, description: "Ambil surat pengantar yang sudah ditandatangani" },
    ],
  },
  {
    id: "legalisir",
    icon: Award,
    title: "Legalisir Dokumen",
    description: "Pengesahan dokumen resmi untuk keperluan administratif, pendidikan, pekerjaan, dan lainnya.",
    duration: "1 hari kerja",
    requirements: [
      { item: "Dokumen asli yang akan dilegalisir" },
      { item: "Fotokopi dokumen" },
      { item: "KTP pemohon" },
      { item: "Surat Pengantar RT/RW (jika diperlukan)" },
    ],
    steps: [
      { step: 1, description: "Siapkan dokumen asli dan fotokopinya" },
      { step: 2, description: "Datang ke kantor kelurahan" },
      { step: 3, description: "Serahkan dokumen ke loket legalisir" },
      { step: 4, description: "Tunggu proses pengesahan" },
      { step: 5, description: "Ambil dokumen yang sudah dilegalisir" },
    ],
  },
  {
    id: "kependudukan",
    icon: Users,
    title: "Administrasi Kependudukan",
    description: "Layanan terkait KTP, Kartu Keluarga, Akta Kelahiran, dan dokumen kependudukan lainnya.",
    duration: "3-7 hari kerja",
    requirements: [
      { item: "Surat Pengantar RT/RW" },
      { item: "Dokumen pendukung sesuai jenis layanan" },
      { item: "Formulir yang telah diisi" },
      { item: "Pas foto sesuai ketentuan" },
    ],
    steps: [
      { step: 1, description: "Tentukan jenis layanan kependudukan yang dibutuhkan" },
      { step: 2, description: "Siapkan dokumen sesuai persyaratan" },
      { step: 3, description: "Datang ke kantor kelurahan" },
      { step: 4, description: "Isi formulir dan serahkan berkas" },
      { step: 5, description: "Ikuti proses verifikasi" },
      { step: 6, description: "Ambil dokumen sesuai jadwal yang ditentukan" },
    ],
  },
  {
    id: "lainnya",
    icon: ClipboardList,
    title: "Layanan Lainnya",
    description: "Berbagai layanan administrasi lainnya seperti surat keterangan tidak mampu, SKCK, dan lainnya.",
    duration: "Bervariasi",
    requirements: [
      { item: "KTP pemohon" },
      { item: "Kartu Keluarga" },
      { item: "Surat Pengantar RT/RW" },
      { item: "Dokumen pendukung sesuai layanan" },
    ],
    steps: [
      { step: 1, description: "Konsultasi ke loket informasi mengenai layanan yang dibutuhkan" },
      { step: 2, description: "Siapkan dokumen sesuai arahan petugas" },
      { step: 3, description: "Serahkan berkas ke loket yang ditentukan" },
      { step: 4, description: "Ikuti prosedur yang berlaku" },
      { step: 5, description: "Ambil dokumen sesuai waktu yang dijadwalkan" },
    ],
  },
];

function ServiceCard({ service }: { service: Service }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = service.icon;

  return (
    <div className="card-government overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-6 text-left flex items-start gap-4 focus-visible:ring-inset"
        aria-expanded={isExpanded}
      >
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-heading font-semibold text-foreground text-lg">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm mt-1">
                {service.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-sm text-muted-foreground">
                  Estimasi: {service.duration}
                </span>
              </div>
            </div>
            <div className="shrink-0 mt-1">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 pt-2 border-t border-border animate-slide-up">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Requirements */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <FileCheck className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-foreground">Persyaratan</h4>
              </div>
              <ul className="space-y-2">
                {service.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{req.item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ClipboardList className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-foreground">Alur Layanan</h4>
              </div>
              <ol className="space-y-2">
                {service.steps.map((step) => (
                  <li key={step.step} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-semibold flex items-center justify-center shrink-0">
                      {step.step}
                    </span>
                    <span className="text-sm text-muted-foreground">{step.description}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LayananPage() {
  return (
    <main id="main-content" className="pt-20">
      {/* Hero */}
      <section className="bg-primary py-16 md:py-20">
        <div className="container-government">
          <div className="max-w-2xl">
            <div className="accent-line mb-4" />
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Layanan Kelurahan
            </h1>
            <p className="text-primary-foreground/80 text-lg">
              Informasi lengkap mengenai layanan administratif yang tersedia di 
              Kelurahan Palmeriam beserta persyaratan dan alur pelayanan.
            </p>
          </div>
        </div>
      </section>

      {/* Info Banner */}
      <section className="bg-accent/10 border-b border-accent/20">
        <div className="container-government py-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-accent shrink-0" />
            <p className="text-sm text-foreground">
              <strong>Jam Pelayanan:</strong> Senin - Jumat, 08:00 - 16:00 WIB. 
              Pastikan dokumen lengkap sebelum datang ke kantor.
            </p>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="section-padding bg-background">
        <div className="container-government">
          <div className="space-y-4">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 p-6 bg-secondary rounded-2xl text-center">
            <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
              Butuh Bantuan Lebih Lanjut?
            </h3>
            <p className="text-muted-foreground mb-4">
              Hubungi kami atau gunakan fitur chatbot untuk pertanyaan cepat
            </p>
            <Button asChild>
              <Link to="/pengaduan">Hubungi Kami</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

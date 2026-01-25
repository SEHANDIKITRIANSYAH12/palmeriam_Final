import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Youtube } from "lucide-react";
import lambangKotaJakartaTimur from "../../assets/Lambang_Kota_Jakarta_Timur.png";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Main Footer */}
      <div className="container-government py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* About */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
                <Image
                  src={lambangKotaJakartaTimur}
                  alt="Lambang Kota Jakarta Timur"
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-lg bg-primary-foreground/10 p-1 object-contain"
                />
              <div>
                <p className="font-heading font-semibold text-lg">SIPALMI</p>
              </div>
            </div>
            <p className="text-primary-foreground/80 text-sm leading-relaxed mb-4">
              Sistem Informasi Pelayanan Kelurahan Palmeriam. Melayani masyarakat dengan sepenuh hati untuk Indonesia yang lebih baik.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                aria-label="Youtube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              {[
                { name: "Beranda", href: "/" },
                { name: "Layanan Kelurahan", href: "/layanan" },
                { name: "Berita & Agenda", href: "/berita" },
                { name: "Pengaduan Masyarakat", href: "/pengaduan" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-primary-foreground/80 hover:text-accent text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Layanan Kami</h3>
            <ul className="space-y-2">
              {[
                "Surat Domisili",
                "Surat Keterangan Usaha",
                "Surat Pengantar RT/RW",
                "Legalisir Dokumen",
                "Administrasi Kependudukan",
              ].map((service) => (
                <li key={service}>
                  <span className="text-primary-foreground/80 text-sm">{service}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-semibold text-lg mb-4">Kontak</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-primary-foreground/80 text-sm">
                  Jl. Palmeriam No. 1, Jakarta Timur, DKI Jakarta 13420
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent shrink-0" />
                <span className="text-primary-foreground/80 text-sm">(021) 1234-5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent shrink-0" />
                <span className="text-primary-foreground/80 text-sm">kelurahan.palmeriam@jakarta.go.id</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent shrink-0" />
                <span className="text-primary-foreground/80 text-sm">Senin - Jumat, 08:00 - 16:00 WIB</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container-government py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/60 text-sm text-center sm:text-left">
            © 2025 Kelurahan Palmeriam. Hak Cipta Dilindungi.
          </p>
          <div className="flex items-center gap-4 text-sm">
            <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
              Kebijakan Privasi
            </a>
            <a href="#" className="text-primary-foreground/60 hover:text-accent transition-colors">
              Syarat & Ketentuan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { useState, useRef } from "react";
import { 
  Users, 
  Building2, 
  Plus, 
  Pencil, 
  Trash2, 
  Save, 
  Search, 
  Image as ImageIcon,
  ArrowUpDown,
  Upload,
  Crop,
  X
} from "lucide-react";
import Image from "next/image";
import ImageCropperModal from "@/components/ImageCropperModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

type OrganisasiMember = {
  id: number;
  nama: string;
  jabatan: string;
  deskripsi: string | null;
  foto: string | null;
  urutan: number;
  isAktif: boolean;
};

type ProfilData = {
  id: number;
  tentang: string;
  visi: string;
  misi: string;
  poinPelayanan: string | null;
};

export default function LandingPageManagement() {
  const { toast } = useToast();
  const qc = useQueryClient();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State for Organisasi
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<OrganisasiMember | null>(null);
  const [formNama, setFormNama] = useState("");
  const [formJabatan, setFormJabatan] = useState("");
  const [formDeskripsi, setFormDeskripsi] = useState("");
  const [formFoto, setFormFoto] = useState("");
  const [formUrutan, setFormUrutan] = useState(1);
  const [formIsAktif, setFormIsAktif] = useState(true);

  // Image Cropper & Upload States
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Format file tidak didukung",
        description: "Harap pilih file gambar (JPG, PNG, atau WebP)",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setRawImageSrc(result);
      setIsCropperOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // Queries
  const orgQuery = useQuery({
    queryKey: ["admin-organisasi"],
    queryFn: () => authFetch<OrganisasiMember[]>("/api/organisasi?all=true"),
  });

  const profilQuery = useQuery({
    queryKey: ["admin-profil"],
    queryFn: () => authFetch<ProfilData>("/api/profil"),
  });

  // State for Profil Form
  const [tentang, setTentang] = useState("");
  const [visi, setVisi] = useState("");
  const [misi, setMisi] = useState("");
  const [poinPelayanan, setPoinPelayanan] = useState("");
  const [isProfilInitialized, setIsProfilInitialized] = useState(false);

  if (profilQuery.data && !isProfilInitialized) {
    setTentang(profilQuery.data.tentang || "");
    setVisi(profilQuery.data.visi || "");
    setMisi(profilQuery.data.misi || "");
    setPoinPelayanan(profilQuery.data.poinPelayanan || "");
    setIsProfilInitialized(true);
  }

  // Mutations for Organisasi
  const saveMemberMutation = useMutation({
    mutationFn: async (payload: Partial<OrganisasiMember>) => {
      if (editingMember) {
        return authFetch(`/api/organisasi/${editingMember.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        return authFetch("/api/organisasi", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-organisasi"] });
      toast({
        title: editingMember ? "Aparatur diperbarui" : "Aparatur ditambahkan",
        description: "Perubahan akan langsung tampil di halaman depan",
      });
      closeModal();
    },
    onError: (err: unknown) => {
      toast({
        title: "Gagal menyimpan",
        description: err instanceof Error ? err.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: (id: number) =>
      authFetch(`/api/organisasi/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-organisasi"] });
      toast({ title: "Data aparatur dihapus" });
    },
    onError: (err: unknown) => {
      toast({
        title: "Gagal menghapus",
        description: err instanceof Error ? err.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    },
  });

  // Mutation for Profil
  const saveProfilMutation = useMutation({
    mutationFn: (payload: Partial<ProfilData>) =>
      authFetch("/api/profil", {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-profil"] });
      toast({
        title: "Profil & Visi Misi disimpan",
        description: "Halaman landing page telah diperbarui",
      });
    },
    onError: (err: unknown) => {
      toast({
        title: "Gagal menyimpan",
        description: err instanceof Error ? err.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    },
  });

  const openAddModal = () => {
    setEditingMember(null);
    setFormNama("");
    setFormJabatan("");
    setFormDeskripsi("");
    setFormFoto("");
    const maxUrutan = (orgQuery.data || []).reduce(
      (max, m) => (m.urutan > max ? m.urutan : max),
      0
    );
    setFormUrutan(maxUrutan + 1);
    setFormIsAktif(true);
    setIsModalOpen(true);
  };

  const openEditModal = (m: OrganisasiMember) => {
    setEditingMember(m);
    setFormNama(m.nama);
    setFormJabatan(m.jabatan);
    setFormDeskripsi(m.deskripsi || "");
    setFormFoto(m.foto || "");
    setFormUrutan(m.urutan);
    setFormIsAktif(m.isAktif);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMember(null);
  };

  const handleSubmitMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama.trim() || !formJabatan.trim()) {
      toast({
        title: "Data belum lengkap",
        description: "Nama dan Jabatan wajib diisi",
        variant: "destructive",
      });
      return;
    }
    saveMemberMutation.mutate({
      nama: formNama.trim(),
      jabatan: formJabatan.trim(),
      deskripsi: formDeskripsi.trim() || null,
      foto: formFoto.trim() || null,
      urutan: Number(formUrutan) || 1,
      isAktif: formIsAktif,
    });
  };

  const handleSaveProfil = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tentang.trim() || !visi.trim() || !misi.trim()) {
      toast({
        title: "Data belum lengkap",
        description: "Tentang, Visi, dan Misi wajib diisi",
        variant: "destructive",
      });
      return;
    }
    saveProfilMutation.mutate({
      tentang: tentang.trim(),
      visi: visi.trim(),
      misi: misi.trim(),
      poinPelayanan: poinPelayanan.trim() || null,
    });
  };

  const filteredMembers = (orgQuery.data || []).filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.nama.toLowerCase().includes(q) ||
      m.jabatan.toLowerCase().includes(q) ||
      (m.deskripsi && m.deskripsi.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Kelola Landing Page
          </h1>
          <p className="text-slate-600">
            Kelola struktur organisasi aparatur kelurahan, visi, misi, dan profil utama SIPALMI
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="organisasi" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 border border-slate-200">
          <TabsTrigger value="organisasi" className="gap-2">
            <Users className="w-4 h-4" />
            Struktur Organisasi
          </TabsTrigger>
          <TabsTrigger value="visi-misi" className="gap-2">
            <Building2 className="w-4 h-4" />
            Visi, Misi & Profil
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: STRUKTUR ORGANISASI */}
        <TabsContent value="organisasi" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Cari nama aparatur atau jabatan..."
                className="pl-10 h-10 border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              onClick={openAddModal}
              className="bg-primary hover:bg-primary/90 text-white shadow-md flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Tambah Aparatur
            </Button>
          </div>

          <Card className="border border-slate-200/80 shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70 hover:bg-slate-50/70">
                  <TableHead className="w-16 text-center">Urutan</TableHead>
                  <TableHead className="w-20">Foto</TableHead>
                  <TableHead>Nama & Gelar</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead className="hidden md:table-cell">Deskripsi Peran</TableHead>
                  <TableHead className="w-28 text-center">Status</TableHead>
                  <TableHead className="w-28 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orgQuery.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-slate-500">
                      Memuat data aparatur...
                    </TableCell>
                  </TableRow>
                ) : filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-slate-500">
                      Belum ada data aparatur. Klik &quot;Tambah Aparatur&quot; untuk memasukkan data baru.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((m) => (
                    <TableRow key={m.id} className="hover:bg-slate-50/50">
                      <TableCell className="text-center font-bold text-slate-600">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-100 text-xs">
                          {m.urutan}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="w-11 h-11 rounded-full overflow-hidden relative bg-slate-100 border border-slate-200">
                          {m.foto ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={m.foto}
                              alt={m.nama}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Users className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-slate-900">
                        {m.nama}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-800 border-emerald-200">
                          {m.jabatan}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-slate-600 max-w-xs truncate">
                        {m.deskripsi || "-"}
                      </TableCell>
                      <TableCell className="text-center">
                        {m.isAktif ? (
                          <Badge className="bg-emerald-600 hover:bg-emerald-600">
                            Aktif
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            Non-aktif
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditModal(m)}
                            className="h-8 w-8 text-slate-600 hover:text-primary hover:bg-primary/10"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              if (confirm(`Yakin ingin menghapus ${m.nama}?`)) {
                                deleteMemberMutation.mutate(m.id);
                              }
                            }}
                            className="h-8 w-8 text-slate-600 hover:text-destructive hover:bg-destructive/10"
                            title="Hapus"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* TAB 2: VISI, MISI & PROFIL */}
        <TabsContent value="visi-misi">
          <Card className="border border-slate-200/80 shadow-sm">
            <CardHeader>
              <CardTitle>Profil Kelurahan, Visi & Misi</CardTitle>
              <CardDescription>
                Teks yang diatur di sini akan langsung tampil pada seksi &quot;Tentang Kelurahan&quot; di halaman utama.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfil} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-800">
                    Tentang Kelurahan Palmeriam
                  </label>
                  <Textarea
                    rows={4}
                    value={tentang}
                    onChange={(e) => setTentang(e.target.value)}
                    placeholder="Deskripsi singkat profil Kelurahan Palmeriam..."
                    className="border-slate-200 text-sm leading-relaxed"
                  />
                  <p className="text-xs text-slate-500">
                    Penjelasan umum mengenai Kelurahan Palmeriam dan komitmen pelayanan.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800">
                      Visi Kelurahan
                    </label>
                    <Textarea
                      rows={4}
                      value={visi}
                      onChange={(e) => setVisi(e.target.value)}
                      placeholder="Pernyataan visi..."
                      className="border-slate-200 text-sm leading-relaxed"
                    />
                    <p className="text-xs text-slate-500">
                      Cita-cita dan arah masa depan pelayanan kelurahan.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-800">
                      Misi Kelurahan
                    </label>
                    <Textarea
                      rows={4}
                      value={misi}
                      onChange={(e) => setMisi(e.target.value)}
                      placeholder="1. Poin misi pertama&#10;2. Poin misi kedua..."
                      className="border-slate-200 text-sm leading-relaxed font-mono"
                    />
                    <p className="text-xs text-slate-500">
                      Langkah-langkah strategis untuk mewujudkan visi (tulis per baris).
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-800">
                    Poin Keunggulan Pelayanan (Checklist)
                  </label>
                  <Textarea
                    rows={4}
                    value={poinPelayanan}
                    onChange={(e) => setPoinPelayanan(e.target.value)}
                    placeholder="Pelayanan cepat dan transparan&#10;Sistem pengaduan 24 jam..."
                    className="border-slate-200 text-sm leading-relaxed font-mono"
                  />
                  <p className="text-xs text-slate-500">
                    Tuliskan 1 poin keunggulan per baris (akan otomatis bercentang hijau di halaman depan).
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end">
                  <Button
                    type="submit"
                    disabled={saveProfilMutation.isPending}
                    className="bg-primary hover:bg-primary/90 text-white shadow-md flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saveProfilMutation.isPending ? "Menyimpan..." : "Simpan Perubahan Profil"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* DIALOG MODAL: TAMBAH / EDIT APARATUR */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? "Edit Aparatur Kelurahan" : "Tambah Aparatur Baru"}
            </DialogTitle>
            <DialogDescription>
              Lengkapi data aparatur di bawah ini untuk ditampilkan pada bagan Struktur Organisasi.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitMember} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Nama Lengkap & Gelar <span className="text-red-500">*</span>
              </label>
              <Input
                value={formNama}
                onChange={(e) => setFormNama(e.target.value)}
                placeholder="Contoh: Setiyawan, S.Pd., M.Si."
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Jabatan Resmi <span className="text-red-500">*</span>
              </label>
              <Input
                value={formJabatan}
                onChange={(e) => setFormJabatan(e.target.value)}
                placeholder="Contoh: Lurah Palmeriam"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  Urutan Tampil
                </label>
                <Input
                  type="number"
                  min={1}
                  value={formUrutan}
                  onChange={(e) => setFormUrutan(Number(e.target.value))}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Status Publikasi
                </label>
                <select
                  value={formIsAktif ? "true" : "false"}
                  onChange={(e) => setFormIsAktif(e.target.value === "true")}
                  className="w-full h-10 px-3 border border-slate-200 rounded-md text-sm bg-white"
                >
                  <option value="true">Tampilkan di Web</option>
                  <option value="false">Sembunyikan</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-primary" />
                  Foto Aparatur
                </span>
                <span className="text-[11px] font-normal text-slate-500">
                  Format persegi / rasio 1:1 direkomendasikan
                </span>
              </label>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 border border-slate-200 rounded-lg bg-slate-50/70">
                {/* Photo Preview */}
                <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-200 border-2 border-dashed border-slate-300 flex-shrink-0 flex items-center justify-center group shadow-sm">
                  {formFoto ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={formFoto}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-8 h-8 text-slate-400" />
                  )}
                  {formFoto && (
                    <button
                      type="button"
                      onClick={() => setFormFoto("")}
                      className="absolute top-1 right-1 p-1 bg-red-600/80 hover:bg-red-600 text-white rounded-full transition-opacity opacity-0 group-hover:opacity-100 shadow"
                      title="Hapus Foto"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Upload & Edit Controls */}
                <div className="flex-1 space-y-2 w-full">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white hover:bg-slate-50 text-slate-700 border-slate-300 font-medium text-xs h-8 flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5 text-primary" />
                      Upload Foto
                    </Button>

                    {formFoto && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setRawImageSrc(formFoto);
                          setIsCropperOpen(true);
                        }}
                        className="bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-200 font-medium text-xs h-8 flex items-center gap-1.5"
                      >
                        <Crop className="w-3.5 h-3.5" />
                        Sesuaikan / Crop
                      </Button>
                    )}

                    {formFoto && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormFoto("")}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs h-8 px-2"
                      >
                        Hapus
                      </Button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    Upload file dari komputer (JPG/PNG/WebP). Anda dapat mengatur posisi geser (pan) dan zoom setelah file dipilih.
                  </p>
                </div>
              </div>

              {/* URL Fallback Input */}
              <div className="pt-1">
                <Input
                  value={formFoto}
                  onChange={(e) => setFormFoto(e.target.value)}
                  placeholder="Atau tempel URL gambar (https://...)"
                  className="text-xs h-8 text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Deskripsi / Ringkasan Tugas
              </label>
              <Textarea
                rows={3}
                value={formDeskripsi}
                onChange={(e) => setFormDeskripsi(e.target.value)}
                placeholder="Contoh: Memimpin dan mengoordinasikan penyelenggaraan pelayanan kelurahan..."
                className="text-xs leading-relaxed"
              />
            </div>

            <DialogFooter className="pt-3 border-t">
              <Button type="button" variant="outline" onClick={closeModal}>
                Batal
              </Button>
              <Button
                type="submit"
                disabled={saveMemberMutation.isPending}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {saveMemberMutation.isPending ? "Menyimpan..." : "Simpan Aparatur"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Image Cropper Modal */}
      <ImageCropperModal
        isOpen={isCropperOpen}
        imageSrc={rawImageSrc || ""}
        onCrop={(croppedDataUrl) => {
          setFormFoto(croppedDataUrl);
        }}
        onClose={() => setIsCropperOpen(false)}
      />
    </div>
  );
}

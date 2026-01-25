import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Save, Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { getToken } from "@/lib/auth";

const schema = z.object({
  judul: z.string().min(1, "Judul wajib diisi"),
  konten: z.string().min(1, "Konten wajib diisi"),
  kategori: z.string().min(1, "Kategori wajib diisi"),
  isPublished: z.boolean(),
});

type FormData = z.infer<typeof schema>;

type Berita = {
  id: number;
  judul: string;
  konten: string;
  kategori: string;
  isPublished: boolean;
};

export default function BeritaFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEdit = !!id;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      isPublished: false,
    },
  });

  const { data: existing, isLoading } = useQuery({
    queryKey: ["admin-berita", id],
    queryFn: () => authFetch<Berita>(`/api/berita/${id}`),
    enabled: isEdit,
  });

  useEffect(() => {
    if (isEdit && existing) {
      reset({
        judul: existing.judul,
        konten: existing.konten,
        kategori: existing.kategori,
        isPublished: existing.isPublished,
      });
    }
  }, [isEdit, existing, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({ title: "File harus berupa gambar", variant: "destructive" });
        return;
      }
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const createMutation = useMutation({
    mutationFn: async (payload: FormData) => {
      const formData = new FormData();
      formData.append("judul", payload.judul);
      formData.append("konten", payload.konten);
      formData.append("kategori", payload.kategori);
      formData.append("isPublished", payload.isPublished.toString());
      if (selectedFile) {
        formData.append("gambar", selectedFile);
      }
      const token = getToken();
      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login kembali.");
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/berita`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal menambah berita");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: isEdit ? "Berita diperbarui" : "Berita ditambahkan" });
      navigate("/admin/berita");
    },
    onError: (err) => {
      toast({
        title: "Gagal",
        description: err instanceof Error ? err.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: FormData) => {
      const formData = new FormData();
      formData.append("judul", payload.judul);
      formData.append("konten", payload.konten);
      formData.append("kategori", payload.kategori);
      formData.append("isPublished", payload.isPublished.toString());
      if (selectedFile) {
        formData.append("gambar", selectedFile);
      }
      const token = getToken();
      if (!token) {
        throw new Error("Token tidak ditemukan. Silakan login kembali.");
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/berita/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Gagal memperbarui berita");
      }
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Berita diperbarui" });
      navigate("/admin/berita");
    },
    onError: (err) => {
      toast({
        title: "Gagal",
        description: err instanceof Error ? err.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  if (isEdit && isLoading) {
    return <div className="p-8 text-center">Memuat data...</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/admin/berita")}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Kembali
        </Button>
        <h1 className="text-2xl font-bold">
          {isEdit ? "Edit Berita" : "Tambah Berita Baru"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Berita</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="judul">Judul</Label>
                <Input id="judul" {...register("judul")} placeholder="Masukkan judul berita" />
                {errors.judul && <p className="text-sm text-red-600">{errors.judul.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="kategori">Kategori</Label>
                <Input id="kategori" {...register("kategori")} placeholder="Contoh: Kegiatan, Pengumuman" />
                {errors.kategori && <p className="text-sm text-red-600">{errors.kategori.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gambar">Gambar</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {previewUrl ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <img src={previewUrl} alt="Preview" className="w-full h-48 object-cover rounded" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={clearImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600">Klik "Ganti Gambar" untuk mengubah</p>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div>
                      <Label htmlFor="gambar-upload" className="cursor-pointer">
                        <span className="text-blue-600 hover:text-blue-700">Pilih file gambar</span>
                        <Input
                          id="gambar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </Label>
                      <p className="text-sm text-gray-500">atau drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF hingga 5MB</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="konten">Konten</Label>
              <Textarea
                id="konten"
                rows={8}
                {...register("konten")}
                placeholder="Tulis konten berita di sini..."
              />
              {errors.konten && <p className="text-sm text-red-600">{errors.konten.message}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isPublished" checked={watch("isPublished")} onCheckedChange={(v) => setValue("isPublished", v)} />
              <Label htmlFor="isPublished">Terbitkan sekarang</Label>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate("/admin/berita")}>
                Batal
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                <Save className="mr-1 h-4 w-4" />
                {isEdit ? "Simpan Perubahan" : "Tambah Berita"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQuery } from "@tanstack/react-query";
import { authFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  judul: z.string().min(1, "Judul wajib diisi"),
  tanggal: z.string().min(1, "Tanggal wajib diisi"),
  waktuMulai: z.string().min(1, "Waktu mulai wajib diisi"),
  waktuSelesai: z.string().min(1, "Waktu selesai wajib diisi"),
  lokasi: z.string().min(1, "Lokasi wajib diisi"),
  kategori: z.string().min(1, "Kategori wajib diisi"),
  peserta: z.number().int().min(0, "Jumlah peserta minimal 0"),
  deskripsi: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type Agenda = {
  id: number;
  judul: string;
  tanggal: string;
  waktuMulai: string;
  waktuSelesai: string;
  lokasi: string;
  kategori: string;
  peserta: number;
  deskripsi?: string;
};

export default function AgendaFormPage({ params }: { params?: Promise<{ id?: string }> }) {
  const resolvedParams = params ? use(params) : { id: undefined };
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = !!resolvedParams.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { data: existing, isLoading } = useQuery({
    queryKey: ["admin-agenda", resolvedParams.id],
    queryFn: () => authFetch<Agenda>(`/api/agenda/${resolvedParams.id}`),
    enabled: isEdit && !!resolvedParams.id,
  });

  useEffect(() => {
    if (isEdit && existing) {
      const dateValue = existing.tanggal 
        ? new Date(existing.tanggal).toISOString().split('T')[0]
        : '';
      
      reset({
        judul: existing.judul,
        tanggal: dateValue,
        waktuMulai: existing.waktuMulai,
        waktuSelesai: existing.waktuSelesai,
        lokasi: existing.lokasi,
        kategori: existing.kategori,
        peserta: existing.peserta,
        deskripsi: existing.deskripsi ?? "",
      });
    }
  }, [isEdit, existing, reset]);

  const createMutation = useMutation({
    mutationFn: (payload: FormData) =>
      authFetch<Agenda>("/api/agenda", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      toast({ title: isEdit ? "Agenda diperbarui" : "Agenda ditambahkan" });
      router.push("/admin/agenda");
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
    mutationFn: (payload: FormData) =>
      authFetch<Agenda>(`/api/agenda/${resolvedParams.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      toast({ title: "Agenda diperbarui" });
      router.push("/admin/agenda");
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
        <Button variant="ghost" size="sm" onClick={() => router.push("/admin/agenda")}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Kembali
        </Button>
        <h1 className="text-2xl font-bold">
          {isEdit ? "Edit Agenda" : "Tambah Agenda Baru"}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Agenda</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="judul">Judul Kegiatan</Label>
              <Input id="judul" {...register("judul")} placeholder="Masukkan judul kegiatan" />
              {errors.judul && <p className="text-sm text-red-600">{errors.judul.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tanggal">Tanggal</Label>
                <Input id="tanggal" type="date" {...register("tanggal")} />
                {errors.tanggal && <p className="text-sm text-red-600">{errors.tanggal.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="kategori">Kategori</Label>
                <Input id="kategori" {...register("kategori")} placeholder="Contoh: Rutin, Kegiatan" />
                {errors.kategori && <p className="text-sm text-red-600">{errors.kategori.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="waktuMulai">Waktu Mulai</Label>
                <Input id="waktuMulai" type="time" {...register("waktuMulai")} />
                {errors.waktuMulai && <p className="text-sm text-red-600">{errors.waktuMulai.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="waktuSelesai">Waktu Selesai</Label>
                <Input id="waktuSelesai" type="time" {...register("waktuSelesai")} />
                {errors.waktuSelesai && <p className="text-sm text-red-600">{errors.waktuSelesai.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lokasi">Lokasi</Label>
              <Input id="lokasi" {...register("lokasi")} placeholder="Contoh: Balai RT 05" />
              {errors.lokasi && <p className="text-sm text-red-600">{errors.lokasi.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="peserta">Jumlah Peserta</Label>
              <Input
                id="peserta"
                type="number"
                min={0}
                {...register("peserta", { valueAsNumber: true })}
                placeholder="0"
              />
              {errors.peserta && <p className="text-sm text-red-600">{errors.peserta.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi (opsional)</Label>
              <Textarea
                id="deskripsi"
                rows={4}
                {...register("deskripsi")}
                placeholder="Tulis deskripsi kegiatan di sini..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => router.push("/admin/agenda")}>
                Batal
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                <Save className="mr-1 h-4 w-4" />
                {isEdit ? "Simpan Perubahan" : "Tambah Agenda"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

# Analisis & Saran Sistem Pengaduan

## 🔍 Masalah yang Ditemukan

### 1. **Frontend Tidak Terhubung ke Backend**
- ❌ Form pengaduan hanya membuat ticket ID lokal, tidak mengirim ke API
- ❌ Tracking hanya mencari di data mock (`complaintsData`), bukan database
- ❌ Data pengaduan tidak tersimpan di database

### 2. **Mismatch Field Antara Frontend & Backend**
- Frontend menggunakan: `name`, `phone`, `email`, `subject`, `message`
- Backend mengharapkan: `pelaporNama`, `pelaporKontak`, `judul`, `deskripsi`
- Tidak ada mapping yang jelas

### 3. **Tidak Ada Sistem Ticket ID**
- Backend hanya menggunakan auto-increment ID (1, 2, 3...)
- Frontend generate ticket ID format: `SIIPALMI-YYYYMMDD-XXXX`
- Tidak ada endpoint untuk tracking berdasarkan ticket ID

### 4. **Tidak Ada Riwayat Status**
- Database tidak menyimpan history perubahan status
- Frontend menampilkan history tapi tidak ada di backend
- Admin tidak bisa menambahkan catatan/notes saat update status

### 5. **Status Tidak Konsisten**
- Frontend: `Diterima`, `Sedang Ditinjau`, `Dalam Pengerjaan`, `Selesai`, `Ditolak`
- Backend: `Baru`, `Diproses`, `Selesai`
- Tidak ada mapping yang jelas

---

## 💡 Saran Perbaikan

### **Opsi 1: Sistem Sederhana (Recommended untuk MVP)**

#### A. Update Database Schema
```prisma
model Pengaduan {
  id            Int      @id @default(autoincrement())
  ticketId      String   @unique // Format: SIIPALMI-YYYYMMDD-XXXX
  judul         String
  deskripsi     String
  status        String   @default("Baru") // Baru, Diproses, Selesai
  prioritas     String   @default("Sedang") // Rendah, Sedang, Tinggi
  pelaporNama   String
  pelaporKontak String?
  pelaporEmail  String?
  lokasi        String?
  kategori      String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}
```

#### B. Update Backend Controller
- Generate ticket ID saat create pengaduan
- Tambah endpoint public untuk tracking: `GET /api/pengaduan/track/:ticketId`
- Mapping field frontend ke backend dengan jelas

#### C. Update Frontend
- Kirim form ke API `/api/pengaduan` (POST)
- Tracking menggunakan endpoint `/api/pengaduan/track/:ticketId`
- Simpan ticket ID di localStorage setelah submit

---

### **Opsi 2: Sistem Lengkap dengan History**

#### A. Update Database Schema
```prisma
model Pengaduan {
  id            Int      @id @default(autoincrement())
  ticketId      String   @unique
  judul         String
  deskripsi     String
  status        String   @default("Baru")
  prioritas     String   @default("Sedang")
  pelaporNama   String
  pelaporKontak String?
  pelaporEmail  String?
  lokasi        String?
  kategori      String
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  history       PengaduanHistory[]
}

model PengaduanHistory {
  id          Int      @id @default(autoincrement())
  pengaduanId Int
  pengaduan   Pengaduan @relation(fields: [pengaduanId], references: [id], onDelete: Cascade)
  status      String
  catatan     String?
  createdAt   DateTime @default(now())
}
```

#### B. Fitur Tambahan
- Admin bisa tambah catatan saat update status
- Auto-create history entry saat status berubah
- Timeline riwayat di detail page

---

## 🎯 Rekomendasi Implementasi

### **Fase 1: Fix Dasar (Penting)**
1. ✅ Connect frontend form ke backend API
2. ✅ Generate ticket ID di backend
3. ✅ Buat endpoint tracking public
4. ✅ Mapping field yang benar

### **Fase 2: Perbaikan UX**
1. ✅ Simpan ticket ID di localStorage
2. ✅ Tampilkan QR code dengan ticket ID
3. ✅ Email/SMS notification (opsional)
4. ✅ Validasi lokasi (opsional)

### **Fase 3: Fitur Lanjutan**
1. ⭐ History tracking
2. ⭐ Upload foto bukti
3. ⭐ Rating kepuasan
4. ⭐ Export laporan

---

## 📋 Field Mapping yang Disarankan

| Frontend | Backend | Keterangan |
|----------|---------|------------|
| `name` | `pelaporNama` | Nama lengkap pelapor |
| `phone` | `pelaporKontak` | Nomor telepon |
| `email` | `pelaporEmail` | Email (opsional) |
| `subject` | `judul` | Judul/subjek pengaduan |
| `message` | `deskripsi` | Isi pengaduan detail |
| `category` | `kategori` | Kategori pengaduan |
| - | `lokasi` | Bisa ditambah field lokasi |
| - | `prioritas` | Auto-set berdasarkan kategori |

---

## 🔄 Alur Kerja yang Disarankan

### **Warga (Public)**
1. Isi form pengaduan → Submit
2. Dapat ticket ID → Simpan/Download QR
3. Lacak status menggunakan ticket ID
4. Lihat update status real-time

### **Admin**
1. Lihat daftar pengaduan baru
2. Buka detail pengaduan
3. Update status (Baru → Diproses → Selesai)
4. Tambah catatan/notes (opsional)
5. Filter & search pengaduan

---

## ⚠️ Catatan Penting

1. **Privacy**: Data pelapor harus dijaga kerahasiaannya
2. **Tracking**: Hanya bisa track dengan ticket ID, tidak dengan nama/phone
3. **Status Flow**: Baru → Diproses → Selesai (atau Ditolak)
4. **Response Time**: Target 1x24 jam untuk update status pertama

---

## 🚀 Langkah Implementasi

Saya bisa membantu implementasi:
1. Update database schema
2. Update backend controller & routes
3. Update frontend form & tracking
4. Testing end-to-end

Apakah Anda ingin saya mulai implementasi sekarang?

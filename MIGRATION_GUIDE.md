# Migration Guide: Vite React → Next.js dengan PostgreSQL

Proyek ini telah dimigrasikan dari Vite + React Router ke Next.js dengan PostgreSQL. Berikut adalah perubahan yang telah dilakukan dan langkah-langkah untuk menyelesaikan migrasi.

## ✅ Perubahan yang Sudah Dilakukan

### 1. Struktur Project
- ✅ Prisma schema dipindahkan ke root `/prisma/schema.prisma`
- ✅ Database provider diubah dari SQLite ke PostgreSQL
- ✅ API routes Express dipindahkan ke Next.js API routes (`/app/api`)
- ✅ Layout dan providers dibuat untuk Next.js

### 2. API Routes
Semua API routes telah dikonversi ke Next.js:
- `/api/auth/login` - Login
- `/api/pengaduan` - CRUD Pengaduan
- `/api/berita` - CRUD Berita
- `/api/agenda` - CRUD Agenda
- `/api/dashboard/stats` - Dashboard stats
- `/api/users` - User management

### 3. Konfigurasi
- ✅ `package.json` - Updated dengan Next.js dependencies
- ✅ `tsconfig.json` - Updated untuk Next.js
- ✅ `next.config.js` - Konfigurasi Next.js
- ✅ `.env.example` - Template environment variables

## 🔄 Yang Perlu Dilakukan

### 1. Install Dependencies
```bash
npm install
# atau
yarn install
```

### 2. Setup Database PostgreSQL
1. Buat database PostgreSQL
2. Update `.env` dengan connection string:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/siipalmi?schema=public"
```

3. Generate Prisma client:
```bash
npm run prisma:generate
```

4. Run migrations:
```bash
npm run prisma:migrate
```

5. Seed database (optional):
```bash
npm run prisma:seed
```

### 3. Konversi Pages yang Tersisa

Halaman-halaman berikut perlu dikonversi dari React Router ke Next.js:

#### Public Pages:
- [ ] `src/pages/BeritaPage.tsx` → `app/(main)/berita/page.tsx`
- [ ] `src/pages/BeritaDetailPage.tsx` → `app/(main)/berita/[id]/page.tsx`
- [ ] `src/pages/PengaduanPage.tsx` → `app/(main)/pengaduan/page.tsx`
- [ ] `src/pages/LayananPage.tsx` → `app/(main)/layanan/page.tsx`
- [ ] `src/pages/NotFound.tsx` → `app/not-found.tsx`

#### Admin Pages:
- [ ] `src/pages/admin/LoginPage.tsx` → `app/admin/login/page.tsx`
- [ ] `src/pages/admin/DashboardPage.tsx` → `app/admin/dashboard/page.tsx`
- [ ] `src/pages/admin/PengaduanPage.tsx` → `app/admin/pengaduan/page.tsx`
- [ ] `src/pages/admin/PengaduanDetailPage.tsx` → `app/admin/pengaduan/[id]/page.tsx`
- [ ] `src/pages/admin/BeritaPage.tsx` → `app/admin/berita/page.tsx`
- [ ] `src/pages/admin/BeritaDetailAdminPage.tsx` → `app/admin/berita/[id]/page.tsx`
- [ ] `src/pages/admin/BeritaFormPage.tsx` → `app/admin/berita/baru/page.tsx` dan `app/admin/berita/edit/[id]/page.tsx`
- [ ] `src/pages/admin/AgendaPage.tsx` → `app/admin/agenda/page.tsx`
- [ ] `src/pages/admin/AgendaDetailPage.tsx` → `app/admin/agenda/[id]/page.tsx`
- [ ] `src/pages/admin/AgendaFormPage.tsx` → `app/admin/agenda/baru/page.tsx` dan `app/admin/agenda/edit/[id]/page.tsx`
- [ ] `src/pages/admin/PengaturanPage.tsx` → `app/admin/pengaturan/page.tsx`

### 4. Perubahan yang Perlu Dilakukan pada Setiap Page

#### Replace Imports:
```typescript
// OLD (React Router)
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";

// NEW (Next.js)
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation"; // Note: useParams works differently
```

#### Replace Navigation:
```typescript
// OLD
const navigate = useNavigate();
navigate("/path");

// NEW
const router = useRouter();
router.push("/path");
```

#### Replace Links:
```typescript
// OLD
<Link to="/path">Text</Link>

// NEW
<Link href="/path">Text</Link>
```

#### Replace useParams:
```typescript
// OLD (React Router)
const { id } = useParams<{ id: string }>();

// NEW (Next.js App Router)
// In page component, params is passed as prop
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // ...
}
```

#### Client Components:
Semua component yang menggunakan hooks (`useState`, `useEffect`, dll) harus ditandai dengan `"use client"` di bagian atas file.

### 5. Update Components

Beberapa components mungkin perlu update:
- Components yang menggunakan `useLocation()` → gunakan `usePathname()` dari `next/navigation`
- Components yang menggunakan `Link` dari react-router → ganti dengan `Link` dari `next/link`

### 6. Update API Calls

API client sudah diupdate untuk menggunakan relative paths. Pastikan semua API calls menggunakan:
- `/api/...` untuk API routes
- Tidak perlu `VITE_API_URL` lagi

### 7. Assets

Assets perlu dipindahkan atau diupdate:
- Pastikan path assets benar (gunakan `/src/assets/...` atau pindahkan ke `/public/...`)
- Untuk Next.js, lebih baik menggunakan `/public/` untuk static assets

## 🚀 Menjalankan Project

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start
```

## 📝 Notes

1. **Prisma**: Pastikan Prisma client di-generate setelah install dependencies
2. **Environment Variables**: Copy `.env.example` ke `.env` dan isi dengan nilai yang sesuai
3. **Database**: Pastikan PostgreSQL sudah running dan database sudah dibuat
4. **Client Components**: Semua component yang menggunakan hooks harus `"use client"`

## 🔍 Troubleshooting

### Error: Cannot find module '@prisma/client'
```bash
npm run prisma:generate
```

### Error: Database connection
- Pastikan PostgreSQL running
- Check DATABASE_URL di `.env`
- Pastikan database sudah dibuat

### Error: Module not found
- Pastikan semua dependencies sudah diinstall
- Check path imports (gunakan `@/` untuk alias)

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Prisma with Next.js](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

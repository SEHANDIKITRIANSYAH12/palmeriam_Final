# Setup Database - Langkah Selanjutnya

Anda sudah di dalam psql. Sekarang:

## 1. Buat Database

Di dalam psql prompt, ketik:
```sql
CREATE DATABASE siipalmi;
```

Jika berhasil, akan muncul: `CREATE DATABASE`

## 2. Keluar dari psql

Ketik:
```sql
\q
```

## 3. Update .env File

Saya akan update file .env dengan DATABASE_URL yang benar. 
Silakan beri tahu username PostgreSQL Anda (default biasanya sama dengan username Mac Anda: `sehandikitriansyah`)

Atau jika menggunakan user `postgres`, beri tahu juga.

## 4. Setelah itu, jalankan:

```bash
cd /Users/sehandikitriansyah/Documents/PROJECT_PPL_PALMERIAM/palmeriam-digital-village
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

---

**Catatan:** 
- Jika database sudah ada, akan muncul error "already exists" - itu normal, lanjutkan saja
- Jika perlu password untuk PostgreSQL, akan diminta saat run migrations

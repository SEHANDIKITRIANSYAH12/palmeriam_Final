# Setup Database untuk Next.js Project

## Langkah-langkah Setup Database

### 1. Pastikan PostgreSQL sudah terinstall dan running

```bash
# Cek apakah PostgreSQL running
psql --version

# Atau jika menggunakan Homebrew (Mac)
brew services list | grep postgresql
```

### 2. Buat Database PostgreSQL

```bash
# Login ke PostgreSQL
psql postgres

# Buat database
CREATE DATABASE siipalmi;

# Keluar dari psql
\q
```

### 3. Update DATABASE_URL di file .env

Edit file `.env` dan update `DATABASE_URL` sesuai dengan konfigurasi PostgreSQL Anda:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/siipalmi?schema=public"
```

**Contoh:**
- Jika username: `postgres` dan password: `postgres`
- `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/siipalmi?schema=public"`

### 4. Generate Prisma Client

```bash
npm run prisma:generate
```

### 5. Run Migrations

```bash
npm run prisma:migrate
```

Jika diminta untuk nama migration, beri nama seperti: `init`

### 6. Seed Database (Optional - untuk membuat admin default)

```bash
npm run prisma:seed
```

Ini akan membuat user admin dengan:
- Username: `admin`
- Password: `admin123`

### 7. Test Database Connection

Jalankan server dan buka: `http://localhost:3000/api/health`

Jika database connected, akan muncul:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "..."
}
```

Jika database tidak connected, akan muncul error message.

## Troubleshooting

### Error: "Can't reach database server"
- Pastikan PostgreSQL service sudah running
- Cek apakah port 5432 sudah benar
- Cek firewall settings

### Error: "Database does not exist"
- Pastikan database `siipalmi` sudah dibuat
- Atau ubah nama database di DATABASE_URL

### Error: "Authentication failed"
- Cek username dan password di DATABASE_URL
- Pastikan user PostgreSQL memiliki akses ke database

### Error: "Prisma Client not generated"
- Jalankan: `npm run prisma:generate`
- Pastikan `node_modules/.prisma/client` sudah ada

### Error: "Migration not found"
- Jalankan: `npm run prisma:migrate`
- Pastikan folder `prisma/migrations` sudah ada

## Quick Setup Script

Jika semua sudah siap, jalankan:

```bash
# 1. Generate Prisma Client
npm run prisma:generate

# 2. Run Migrations
npm run prisma:migrate

# 3. Seed Database (optional)
npm run prisma:seed

# 4. Start Server
npm run dev
```

Setelah itu, buka `http://localhost:3000/api/health` untuk test connection.

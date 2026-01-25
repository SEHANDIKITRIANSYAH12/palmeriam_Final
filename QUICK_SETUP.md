# Quick Setup Guide

## Cara Setup Database (Pilih salah satu):

### Opsi 1: Menggunakan Script Otomatis (Recommended)

```bash
./setup-db.sh
```

Script ini akan:
- ✅ Cek apakah PostgreSQL installed & running
- ✅ Start PostgreSQL service jika belum running
- ✅ Buat database `siipalmi`
- ✅ Update file `.env` dengan DATABASE_URL
- ✅ Generate Prisma Client
- ✅ Run migrations
- ✅ Seed database (optional)

### Opsi 2: Manual Setup

#### 1. Start PostgreSQL Service

```bash
# Mac (Homebrew)
brew services start postgresql@14

# Atau
brew services start postgresql
```

#### 2. Buat Database

```bash
# Login ke PostgreSQL
psql postgres

# Buat database
CREATE DATABASE siipalmi;

# Keluar
\q
```

#### 3. Update .env

Edit file `.env` dan update `DATABASE_URL`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/siipalmi?schema=public"
```

**Contoh:**
- Jika username: `postgres` dan password: `postgres`
- `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/siipalmi?schema=public"`

#### 4. Generate Prisma Client & Run Migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

#### 5. Seed Database (Optional)

```bash
npm run prisma:seed
```

Ini akan membuat user admin:
- Username: `admin`
- Password: `admin123`

#### 6. Test Connection

Buka: `http://localhost:3000/api/health`

---

## Troubleshooting

### PostgreSQL tidak running
```bash
# Cek status
brew services list | grep postgresql

# Start service
brew services start postgresql@14
```

### Database connection error
- Pastikan PostgreSQL service running
- Cek username & password di DATABASE_URL
- Pastikan database `siipalmi` sudah dibuat

### Permission denied
```bash
# Jika error permission, coba:
sudo chmod 755 setup-db.sh
./setup-db.sh
```

---

**Setelah setup selesai, jalankan:**
```bash
npm run dev
```

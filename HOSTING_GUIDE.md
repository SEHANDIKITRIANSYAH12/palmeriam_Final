# 🚀 Panduan Hosting SIPALMI

Panduan lengkap untuk hosting website SIPALMI (Frontend, Backend, dan Database) ke berbagai platform.

---

## 📋 Daftar Isi

1. [Persiapan Sebelum Hosting](#persiapan-sebelum-hosting)
2. [Opsi Hosting](#opsi-hosting)
3. [Hosting dengan Vercel (Recommended)](#hosting-dengan-vercel-recommended)
4. [Hosting dengan Railway](#hosting-dengan-railway)
5. [Hosting dengan Render](#hosting-dengan-render)
6. [Hosting dengan DigitalOcean](#hosting-dengan-digitalocean)
7. [Hosting dengan VPS (Ubuntu)](#hosting-dengan-vps-ubuntu)
8. [Setup Database Production](#setup-database-production)
9. [Environment Variables](#environment-variables)
10. [Troubleshooting](#troubleshooting)

---

## 🔧 Persiapan Sebelum Hosting

### 1. Update Database untuk Production

**Saat ini project menggunakan SQLite (file database). Untuk production, disarankan menggunakan PostgreSQL atau MySQL.**

#### A. Migrasi ke PostgreSQL (Recommended)

1. **Install PostgreSQL di server atau gunakan managed database**

2. **Update `server/prisma/schema.prisma`:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

3. **Update `DATABASE_URL` di environment:**
```env
DATABASE_URL="postgresql://user:password@host:5432/database_name?schema=public"
```

4. **Generate Prisma Client:**
```bash
cd server
npx prisma generate
```

5. **Run Migration:**
```bash
npx prisma migrate deploy
```

#### B. Atau Tetap Gunakan SQLite (untuk testing/small scale)

SQLite bisa digunakan untuk production jika traffic rendah, tapi tidak disarankan untuk production yang serius.

---

### 2. Build Project

#### Build Frontend:
```bash
npm run build
```
Output akan di folder `dist/`

#### Build Backend:
```bash
cd server
npm run build
```
Output akan di folder `server/dist/`

---

### 3. Environment Variables

Buat file `.env` untuk production dengan variabel berikut:

**Frontend (.env):**
```env
VITE_API_URL=https://your-backend-url.com
VITE_N8N_WEBHOOK_URL=https://your-n8n-webhook-url
```

**Backend (server/.env):**
```env
DATABASE_URL="postgresql://user:password@host:5432/database_name"
JWT_SECRET="your-very-secure-secret-key-here-min-32-chars"
PORT=5000
NODE_ENV=production
```

---

## 🌐 Opsi Hosting

### Opsi 1: Vercel (Frontend) + Railway (Backend) - ⭐ Recommended
- ✅ Gratis untuk mulai
- ✅ Mudah setup
- ✅ Auto deployment dari Git
- ✅ Managed database

### Opsi 2: Vercel (Full Stack)
- ✅ Semua di satu platform
- ✅ Gratis untuk mulai
- ⚠️ Backend sebagai serverless functions

### Opsi 3: Railway (Full Stack)
- ✅ Full stack hosting
- ✅ Managed PostgreSQL
- ✅ Auto deployment

### Opsi 4: Render (Full Stack)
- ✅ Gratis tier tersedia
- ✅ Managed PostgreSQL
- ✅ Auto deployment

### Opsi 5: DigitalOcean App Platform
- ✅ Managed platform
- ✅ Managed database
- 💰 Berbayar tapi affordable

### Opsi 6: VPS (Ubuntu + PM2 + Nginx)
- ✅ Full control
- ✅ Lebih murah untuk long-term
- ⚠️ Perlu setup manual

---

## 🚀 Hosting dengan Vercel (Recommended)

### Frontend di Vercel

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Login ke Vercel:**
```bash
vercel login
```

3. **Deploy Frontend:**
```bash
# Di root project
vercel
```

4. **Atau via Vercel Dashboard:**
   - Push code ke GitHub
   - Import project di Vercel
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Add environment variables:
     - `VITE_API_URL`
     - `VITE_N8N_WEBHOOK_URL`

### Backend di Railway

1. **Sign up di [Railway.app](https://railway.app)**

2. **Create New Project:**
   - Klik "New Project"
   - Pilih "Deploy from GitHub repo"
   - Pilih repository Anda

3. **Setup Backend Service:**
   - Root Directory: `server`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Add Environment Variables:
     ```
     DATABASE_URL=...
     JWT_SECRET=...
     NODE_ENV=production
     PORT=5000
     ```

4. **Setup PostgreSQL Database:**
   - Klik "New" → "Database" → "PostgreSQL"
   - Railway akan otomatis set `DATABASE_URL`
   - Copy `DATABASE_URL` ke environment variables

5. **Run Migration:**
   - Buka Railway dashboard
   - Klik service backend
   - Klik "Deployments" → "View Logs"
   - Atau buka terminal di Railway dan run:
     ```bash
     npx prisma migrate deploy
     npx prisma generate
     ```

6. **Get Backend URL:**
   - Railway akan memberikan URL seperti: `https://your-app.railway.app`
   - Update `VITE_API_URL` di Vercel dengan URL ini

---

## 🚂 Hosting dengan Railway (Full Stack)

### 1. Setup Frontend

1. **Create New Service:**
   - Root Directory: `/` (root project)
   - Build Command: `npm install && npm run build`
   - Start Command: `npx serve -s dist -l 3000`
   - Add Environment Variables:
     ```
     VITE_API_URL=https://your-backend-url.railway.app
     ```

### 2. Setup Backend

1. **Create New Service:**
   - Root Directory: `/server`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Add Environment Variables:
     ```
     DATABASE_URL=...
     JWT_SECRET=...
     NODE_ENV=production
     PORT=5000
     ```

### 3. Setup Database

1. **Add PostgreSQL:**
   - Klik "New" → "Database" → "PostgreSQL"
   - Railway akan set `DATABASE_URL` otomatis

2. **Update Backend Environment:**
   - Copy `DATABASE_URL` dari database service
   - Paste ke backend service environment variables

3. **Run Migration:**
   - Buka terminal di backend service
   - Run:
     ```bash
     npx prisma migrate deploy
     npx prisma generate
     ```

### 4. Update Frontend

- Update `VITE_API_URL` di frontend service dengan URL backend Railway

---

## 🎨 Hosting dengan Render

### 1. Setup Backend

1. **Create New Web Service:**
   - Connect GitHub repository
   - Name: `sipalmi-backend`
   - Environment: `Node`
   - Build Command: `cd server && npm install && npm run build`
   - Start Command: `cd server && npm start`
   - Add Environment Variables:
     ```
     DATABASE_URL=...
     JWT_SECRET=...
     NODE_ENV=production
     PORT=10000
     ```

### 2. Setup Database

1. **Create PostgreSQL Database:**
   - Klik "New" → "PostgreSQL"
   - Render akan memberikan connection string
   - Copy ke `DATABASE_URL` di backend service

2. **Run Migration:**
   - Buka Shell di backend service
   - Run:
     ```bash
     cd server
     npx prisma migrate deploy
     npx prisma generate
     ```

### 3. Setup Frontend

1. **Create New Static Site:**
   - Connect GitHub repository
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Add Environment Variables:
     ```
     VITE_API_URL=https://your-backend.onrender.com
     ```

---

## 💻 Hosting dengan VPS (Ubuntu)

### Prerequisites
- VPS Ubuntu 20.04/22.04
- Domain name (optional)
- SSH access

### 1. Setup Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2
```

### 2. Setup Database

```bash
# Login ke PostgreSQL
sudo -u postgres psql

# Create database dan user
CREATE DATABASE sipalmi;
CREATE USER sipalmi_user WITH PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE sipalmi TO sipalmi_user;
\q
```

### 3. Deploy Backend

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/your-username/your-repo.git sipalmi
cd sipalmi/server

# Install dependencies
npm install --production

# Create .env file
sudo nano .env
```

**Isi .env:**
```env
DATABASE_URL="postgresql://sipalmi_user:your-secure-password@localhost:5432/sipalmi"
JWT_SECRET="your-very-secure-secret-key-min-32-chars"
NODE_ENV=production
PORT=5000
```

```bash
# Build backend
npm run build

# Run migration
npx prisma migrate deploy
npx prisma generate

# Start dengan PM2
pm2 start dist/server.js --name sipalmi-backend
pm2 save
pm2 startup
```

### 4. Deploy Frontend

```bash
# Build frontend
cd /var/www/sipalmi
npm install
npm run build

# Copy build files
sudo cp -r dist/* /var/www/html/
```

### 5. Setup Nginx

```bash
sudo nano /etc/nginx/sites-available/sipalmi
```

**Isi file:**
```nginx
# Frontend
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /var/www/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API Proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/sipalmi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 6. Setup SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## 🗄️ Setup Database Production

### PostgreSQL (Recommended)

#### A. Managed Database (Railway, Render, Supabase)

**Railway:**
- Klik "New" → "Database" → "PostgreSQL"
- Otomatis dapat connection string

**Render:**
- Klik "New" → "PostgreSQL"
- Copy connection string

**Supabase (Gratis):**
1. Sign up di [supabase.com](https://supabase.com)
2. Create new project
3. Copy connection string dari Settings → Database

#### B. Self-Hosted PostgreSQL

```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres psql
CREATE DATABASE sipalmi;
CREATE USER sipalmi_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE sipalmi TO sipalmi_user;
\q
```

### Update Prisma Schema

```prisma
// server/prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Run Migration

```bash
cd server
npx prisma migrate deploy
npx prisma generate
```

---

## 🔐 Environment Variables

### Frontend (.env atau di hosting platform)

```env
VITE_API_URL=https://your-backend-url.com
VITE_N8N_WEBHOOK_URL=https://your-n8n-webhook-url
```

### Backend (server/.env atau di hosting platform)

```env
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-very-secure-secret-key-minimum-32-characters
NODE_ENV=production
PORT=5000
```

**⚠️ Penting:**
- Jangan commit `.env` ke Git
- Gunakan environment variables di hosting platform
- `JWT_SECRET` harus sangat aman (min 32 karakter, random)

---

## 📝 Checklist Deployment

### Sebelum Deploy:
- [ ] Update database ke PostgreSQL (jika perlu)
- [ ] Build frontend berhasil (`npm run build`)
- [ ] Build backend berhasil (`cd server && npm run build`)
- [ ] Environment variables sudah disiapkan
- [ ] Database migration sudah dijalankan
- [ ] Test di local production build

### Setelah Deploy:
- [ ] Frontend bisa diakses
- [ ] Backend API bisa diakses (`/api/health`)
- [ ] Database connection berhasil
- [ ] Login admin berfungsi
- [ ] Semua fitur utama berfungsi
- [ ] SSL/HTTPS sudah setup (jika pakai domain)

---

## 🐛 Troubleshooting

### Backend tidak bisa connect ke database
- ✅ Pastikan `DATABASE_URL` benar
- ✅ Pastikan database sudah dibuat
- ✅ Pastikan user memiliki permission
- ✅ Pastikan firewall allow connection

### Frontend tidak bisa connect ke backend
- ✅ Pastikan `VITE_API_URL` benar
- ✅ Pastikan backend sudah running
- ✅ Cek CORS settings di backend
- ✅ Cek network tab di browser

### Build error
- ✅ Pastikan semua dependencies terinstall
- ✅ Pastikan Node.js version sesuai (18+)
- ✅ Clear cache: `rm -rf node_modules package-lock.json && npm install`

### Migration error
- ✅ Pastikan database sudah dibuat
- ✅ Pastikan `DATABASE_URL` benar
- ✅ Run: `npx prisma migrate reset` (hati-hati, akan hapus data)

---

## 🎯 Rekomendasi Setup Production

### Untuk Production Serius:
1. **Frontend:** Vercel atau Cloudflare Pages
2. **Backend:** Railway atau Render
3. **Database:** Managed PostgreSQL (Railway, Render, atau Supabase)
4. **Domain:** Cloudflare (untuk DNS dan CDN)
5. **Monitoring:** Sentry (untuk error tracking)

### Untuk Budget Terbatas:
1. **Full Stack:** Railway (free tier cukup untuk mulai)
2. **Database:** Supabase (free tier)
3. **Domain:** Namecheap atau Cloudflare

### Untuk Full Control:
1. **VPS:** DigitalOcean Droplet ($6/bulan)
2. **Database:** PostgreSQL di VPS yang sama
3. **Domain:** Cloudflare
4. **SSL:** Let's Encrypt (gratis)

---

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)

---

## 💡 Tips

1. **Selalu gunakan HTTPS** untuk production
2. **Backup database** secara rutin
3. **Monitor logs** untuk error
4. **Setup alerts** untuk downtime
5. **Gunakan CDN** untuk static assets
6. **Enable caching** untuk performa
7. **Setup CI/CD** untuk auto deployment

---

**Selamat Deploy! 🚀**

Jika ada pertanyaan atau masalah, silakan buka issue di repository atau hubungi support hosting platform yang digunakan.

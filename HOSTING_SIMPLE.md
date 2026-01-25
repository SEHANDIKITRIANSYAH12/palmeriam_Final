# 🚀 Hosting SIPALMI - Cara Paling Mudah

Panduan super simple untuk hosting website SIPALMI tanpa ribet!

---

## ⚡ Opsi Termudah: Railway (All-in-One)

Railway bisa host frontend, backend, dan database sekaligus. **Paling mudah!**

### Langkah-langkah (5 menit):

#### 1. Push Code ke GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push
```

#### 2. Deploy di Railway

1. **Daftar di [railway.app](https://railway.app)** (gratis, pakai GitHub login)

2. **Create New Project:**
   - Klik "New Project"
   - Pilih "Deploy from GitHub repo"
   - Pilih repository Anda

3. **Setup Database (PostgreSQL):**
   - Klik "New" → "Database" → "PostgreSQL"
   - Railway otomatis buat database
   - Copy `DATABASE_URL` (otomatis ter-set)

4. **Setup Backend:**
   - Klik "New" → "GitHub Repo"
   - Pilih repository yang sama
   - **Settings:**
     - Root Directory: `server`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
   - **Environment Variables:**
     - `DATABASE_URL` → Copy dari database service (otomatis)
     - `JWT_SECRET` → Buat random string (min 32 karakter)
     - `NODE_ENV` → `production`
     - `PORT` → `5000`

5. **Run Migration:**
   - Klik backend service
   - Klik "Deployments" → "View Logs"
   - Atau buka terminal di Railway
   - Run:
     ```bash
     cd server
     npx prisma migrate deploy
     npx prisma generate
     ```

6. **Setup Frontend:**
   - Klik "New" → "GitHub Repo"
   - Pilih repository yang sama
   - **Settings:**
     - Root Directory: `/` (root)
     - Build Command: `npm install && npm run build`
     - Start Command: `npx serve -s dist -l 3000`
   - **Environment Variables:**
     - `VITE_API_URL` → URL backend Railway (contoh: `https://your-backend.railway.app`)

#### 3. Selesai! 🎉

Railway akan otomatis:
- ✅ Deploy setiap kali push ke GitHub
- ✅ Handle SSL/HTTPS
- ✅ Scale otomatis
- ✅ Monitoring

---

## 🎯 Alternatif: Vercel (Frontend) + Railway (Backend)

### Frontend di Vercel (2 klik):

1. **Push code ke GitHub**

2. **Import di Vercel:**
   - Buka [vercel.com](https://vercel.com)
   - Klik "Add New" → "Project"
   - Import dari GitHub
   - **Settings:**
     - Framework: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - **Environment Variables:**
     - `VITE_API_URL` → URL backend Railway

3. **Deploy** → Selesai!

### Backend di Railway:
- Ikuti langkah 2-5 di atas (Railway All-in-One)

---

## 💡 Tips Supaya Tidak Ribet

### 1. Gunakan Managed Database
- ✅ Railway Database (otomatis)
- ✅ Supabase (gratis, mudah)
- ❌ Jangan self-host database sendiri

### 2. Auto Deploy dari GitHub
- ✅ Push code → Auto deploy
- ✅ Tidak perlu manual upload

### 3. Environment Variables
- ✅ Set sekali di dashboard
- ✅ Tidak perlu edit file manual

### 4. SSL/HTTPS
- ✅ Otomatis di Railway/Vercel
- ✅ Tidak perlu setup manual

---

## 🔄 Update Database Schema

Jika perlu update schema:

1. **Edit `server/prisma/schema.prisma`**

2. **Create migration:**
   ```bash
   cd server
   npx prisma migrate dev --name update_schema
   ```

3. **Deploy migration:**
   - Di Railway terminal:
     ```bash
     npx prisma migrate deploy
     ```

---

## 📝 Checklist Simple

- [ ] Code sudah di GitHub
- [ ] Railway account sudah dibuat
- [ ] Database PostgreSQL dibuat di Railway
- [ ] Backend service dibuat di Railway
- [ ] Frontend service dibuat di Railway/Vercel
- [ ] Environment variables sudah di-set
- [ ] Migration sudah dijalankan
- [ ] Test website sudah berfungsi

---

## 🆚 Perbandingan dengan Next.js

| Fitur | Next.js | Project Ini (Vite + Express) |
|-------|---------|------------------------------|
| Setup | ✅ Mudah (1 platform) | ⚠️ Perlu 2-3 service |
| Database | ✅ Built-in support | ⚠️ Perlu setup terpisah |
| Deployment | ✅ 1 klik | ⚠️ Perlu setup manual |
| Full Stack | ✅ Terintegrasi | ⚠️ Terpisah |

**Tapi dengan Railway, hampir sama mudahnya!** 🚀

---

## 🎓 Next Steps

1. **Coba Railway dulu** (paling mudah)
2. Jika butuh lebih simple, bisa convert ke Next.js nanti
3. Atau tetap pakai ini tapi dengan Railway (sudah cukup mudah)

---

**Intinya: Pakai Railway untuk semua (frontend + backend + database) = Paling mudah!** ✨

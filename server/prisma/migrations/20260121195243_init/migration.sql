-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Pengaduan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Baru',
    "prioritas" TEXT NOT NULL DEFAULT 'Sedang',
    "pelaporNama" TEXT NOT NULL,
    "pelaporKontak" TEXT,
    "lokasi" TEXT,
    "kategori" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Berita" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "judul" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "gambar" TEXT,
    "kategori" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "penulisId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Berita_penulisId_fkey" FOREIGN KEY ("penulisId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Agenda" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "tanggal" DATETIME NOT NULL,
    "waktuMulai" TEXT NOT NULL,
    "waktuSelesai" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "peserta" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

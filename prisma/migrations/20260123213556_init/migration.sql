-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pengaduan" (
    "id" SERIAL NOT NULL,
    "ticketId" TEXT NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Baru',
    "prioritas" TEXT NOT NULL DEFAULT 'Sedang',
    "pelaporNama" TEXT NOT NULL,
    "pelaporKontak" TEXT,
    "pelaporEmail" TEXT,
    "lokasi" TEXT,
    "kategori" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pengaduan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Berita" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "konten" TEXT NOT NULL,
    "gambar" TEXT,
    "kategori" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "penulisId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Berita_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agenda" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL,
    "waktuMulai" TEXT NOT NULL,
    "waktuSelesai" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "peserta" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Pengaduan_ticketId_key" ON "Pengaduan"("ticketId");

-- AddForeignKey
ALTER TABLE "Berita" ADD CONSTRAINT "Berita_penulisId_fkey" FOREIGN KEY ("penulisId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

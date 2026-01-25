/*
  Warnings:

  - Added the required column `ticketId` to the `Pengaduan` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pengaduan" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Pengaduan" ("createdAt", "deskripsi", "id", "judul", "kategori", "lokasi", "pelaporKontak", "pelaporNama", "prioritas", "status", "updatedAt", "ticketId") 
SELECT 
  "createdAt", 
  "deskripsi", 
  "id", 
  "judul", 
  "kategori", 
  "lokasi", 
  "pelaporKontak", 
  "pelaporNama", 
  "prioritas", 
  "status", 
  "updatedAt",
  'SIIPALMI-' || strftime('%Y%m%d', "createdAt") || '-' || upper(substr(hex(randomblob(2)), 1, 4)) as "ticketId"
FROM "Pengaduan";
DROP TABLE "Pengaduan";
ALTER TABLE "new_Pengaduan" RENAME TO "Pengaduan";
CREATE UNIQUE INDEX "Pengaduan_ticketId_key" ON "Pengaduan"("ticketId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

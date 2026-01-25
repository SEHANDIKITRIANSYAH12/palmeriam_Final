import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";

import { notFound, errorHandler } from "./middlewares/error.middleware";
import authRoutes from "./routes/auth.routes";
import pengaduanRoutes from "./routes/pengaduan.routes";
import beritaRoutes from "./routes/berita.routes";
import agendaRoutes from "./routes/agenda.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import userRoutes from "./routes/user.routes";

const app = express();

// Multer config untuk upload gambar ke memory
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/pengaduan", pengaduanRoutes);
app.use("/api/berita", beritaRoutes);
app.use("/api/agenda", agendaRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

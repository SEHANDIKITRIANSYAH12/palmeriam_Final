"use client";

import { use } from "react";
import BeritaFormPage from "../../baru/page";

export default function BeritaEditPage({ params }: { params: Promise<{ id: string }> }) {
  return <BeritaFormPage params={params} />;
}

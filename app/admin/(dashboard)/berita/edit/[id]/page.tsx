"use client";

import BeritaFormPage from "../../baru/page";

export default function BeritaEditPage({ params }: { params: Promise<{ id: string }> }) {
  return <BeritaFormPage params={params} />;
}

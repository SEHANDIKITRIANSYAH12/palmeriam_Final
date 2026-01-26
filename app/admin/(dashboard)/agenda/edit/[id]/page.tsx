"use client";

import AgendaFormPage from "../../baru/page";

export default function AgendaEditPage({ params }: { params: Promise<{ id: string }> }) {
  return <AgendaFormPage params={params} />;
}

import type { Metadata } from "next";
import { CardGrid } from "@/components/TranslationCard";
import { byTitle, untranslatedList } from "@/lib/catalog";

export const metadata: Metadata = { title: "Untranslated", robots: { index: false } };

export default function UntranslatedPage() {
  return (
    <>
      <h1>Untranslated</h1>
      <p className="muted">Lyrics I’ve collected but haven’t translated yet.</p>
      <CardGrid items={[...untranslatedList].sort(byTitle)} />
    </>
  );
}

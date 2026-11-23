import type { Metadata } from "next";
import { CardGrid } from "@/components/TranslationCard";
import { byTitle, listed } from "@/lib/catalog";

export const metadata: Metadata = { title: "All translations" };

export default function SongsPage() {
  const translations = [...listed].sort(byTitle);
  return (
    <>
      <h1>All translations</h1>
      <p className="muted">{listed.length} songs. Entries marked “Incomplete”, “Needs revision” or “Older draft” are works in progress.</p>
      <CardGrid items={translations} />
    </>
  );
}

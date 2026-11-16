import type { Metadata } from "next";
import { CardGrid } from "@/components/TranslationCard";
import { byTitle, published } from "@/lib/catalog";

export const metadata: Metadata = { title: "All translations" };

export default function SongsPage() {
  const translations = published.filter((t) => t.kind === "translation").sort(byTitle);
  const reverse = published.filter((t) => t.kind === "reverse").sort(byTitle);
  return (
    <>
      <h1>All translations</h1>
      <p className="muted">{published.length} songs. Entries marked “Incomplete”, “Needs revision” or “Older draft” are works in progress.</p>
      <CardGrid items={translations} />
      <h2 id="reverse">Reverse translations (English → Japanese)</h2>
      <CardGrid items={reverse} />
    </>
  );
}

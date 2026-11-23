import type { Metadata } from "next";
import { NsfwGate } from "@/components/NsfwGate";
import { CardGrid } from "@/components/TranslationCard";
import { byTitle, nsfwList } from "@/lib/catalog";

export const metadata: Metadata = { title: "NSFW", robots: { index: false } };

export default function NsfwPage() {
  return (
    <NsfwGate>
      <h1>NSFW</h1>
      <p className="muted">Translations of songs with explicit or adult themes, kept apart from the rest of the site.</p>
      <CardGrid items={[...nsfwList].sort(byTitle)} />
    </NsfwGate>
  );
}

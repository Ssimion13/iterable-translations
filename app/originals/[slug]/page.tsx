import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CardGrid } from "@/components/TranslationCard";
import { ORIGINALS, byOriginal, originalKeys } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return originalKeys().map((slug) => ({ slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const o = ORIGINALS[(await params).slug];
  return o ? { title: o.titleEn } : {};
}

export default async function OriginalPage({ params }: Props) {
  const { slug } = await params;
  const o = ORIGINALS[slug];
  const items = byOriginal(slug);
  if (!o || !items.length) notFound();
  return (
    <>
      <p className="crumb"><Link href="/originals">← Original songs</Link></p>
      <h1 lang="ja">{o.title}</h1>
      {o.titleEn !== o.title && <p className="song-ja">{o.titleEn}</p>}
      <p className="muted">{o.source}</p>
      {/* TODO: notes about the original song */}
      <h2>{items.length} translated arrange{items.length === 1 ? "" : "s"}</h2>
      <CardGrid items={items} />
    </>
  );
}

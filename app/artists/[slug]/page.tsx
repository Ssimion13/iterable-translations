import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CardGrid } from "@/components/TranslationCard";
import { ARTISTS, UNSORTED_ARTIST, artistKeys, artistName, byArtist } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return artistKeys().map((slug) => ({ slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: artistName((await params).slug) };
}

export default async function ArtistPage({ params }: Props) {
  const { slug } = await params;
  const items = byArtist(slug);
  if (!items.length) notFound();
  return (
    <>
      <p className="crumb"><Link href="/artists">← Artists</Link></p>
      <h1>{artistName(slug)}</h1>
      {ARTISTS[slug]?.nameJa && <p className="song-ja" lang="ja">{ARTISTS[slug].nameJa}</p>}
      {slug === UNSORTED_ARTIST && (
        <p className="muted">These files didn’t note the artist or circle. Add an <code>artist</code> in <code>content/catalog.ts</code> to move them.</p>
      )}
      <CardGrid items={items} showArtist={false} />
    </>
  );
}

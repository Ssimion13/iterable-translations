import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/StatusBadge";
import {
  ORIGINALS,
  STATUS_NOTE,
  UNSORTED_ARTIST,
  artistName,
  getBody,
  getTranslation,
  published,
  versionsOf,
} from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return published.map((t) => ({ slug: t.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const t = getTranslation((await params).slug);
  if (!t) return {};
  return { title: t.titleJa ? `${t.title} (${t.titleJa})` : t.title, description: t.description };
}

export default async function SongPage({ params }: Props) {
  const t = getTranslation((await params).slug);
  if (!t) notFound();
  const original = t.original ? ORIGINALS[t.original] : undefined;
  const versions = versionsOf(t);
  const artistKey = t.artist ?? UNSORTED_ARTIST;

  return (
    <article className="song">
      <header className="song-header">
        <h1>{t.title}</h1>
        {t.titleJa && <p className="song-ja" lang="ja">{t.titleJa}</p>}
        <dl className="song-meta">
          <div>
            <dt>Artist</dt>
            <dd><Link href={`/artists/${artistKey}`}>{artistName(artistKey)}</Link></dd>
          </div>
          {original && (
            <div>
              <dt>Original</dt>
              <dd>
                <Link href={`/originals/${t.original}`}>{original.titleEn}</Link>
                {t.originalUnsure && <span className="muted"> (unconfirmed)</span>}
              </dd>
            </div>
          )}
          {t.kind === "reverse" && (
            <div>
              <dt>Direction</dt>
              <dd>English → Japanese</dd>
            </div>
          )}
        </dl>
        <p className="song-desc">{t.description}</p>
        {t.status !== "complete" && (
          <p className={`notice notice-${t.status}`}>
            <StatusBadge status={t.status} /> {STATUS_NOTE[t.status]}
          </p>
        )}
      </header>

      <div className="lyrics" dangerouslySetInnerHTML={{ __html: getBody(t.slug) }} />

      {versions.length > 0 && (
        <aside className="versions">
          <h2>Other versions of this translation</h2>
          <ul>
            {versions.map((v) => (
              <li key={v.slug}>
                <Link href={`/songs/${v.slug}`}>{v.title}</Link> <StatusBadge status={v.status} />
              </li>
            ))}
          </ul>
        </aside>
      )}
    </article>
  );
}

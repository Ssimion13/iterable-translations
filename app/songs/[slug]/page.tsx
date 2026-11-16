import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NotePopover } from "@/components/NotePopover";
import { StatusBadge } from "@/components/StatusBadge";
import {
  ORIGINALS,
  STATUS_NOTE,
  UNSORTED_ARTIST,
  artistName,
  getBody,
  monthRange,
  monthYear,
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
          <div>
            <dt>Last edited</dt>
            <dd>
              <time dateTime={t.lastEdited}>{monthYear(t.lastEdited)}</time>
              {t.dateNote && <span className="muted"> · {t.dateNote}</span>}
            </dd>
          </div>
          {t.notesWritten && (
            <div>
              <dt>Notes written</dt>
              <dd>{monthRange(t.notesWritten)}</dd>
            </div>
          )}
        </dl>
        <p className="song-desc">{t.description}</p>
        {t.status !== "complete" && (
          <p className={`notice notice-${t.status}`}>
            <StatusBadge status={t.status} /> {STATUS_NOTE[t.status]}
          </p>
        )}
        {versions.length > 0 && (
          <nav className="versions" aria-label="Versions of this translation">
            <h2>{versions.length} versions of this translation</h2>
            <ol>
              {versions.map((v) => (
                <li key={v.slug} className={v.slug === t.slug ? "is-current" : undefined}>
                  {v.slug === t.slug ? (
                    <span aria-current="page">{v.title}</span>
                  ) : (
                    <Link href={`/songs/${v.slug}`}>{v.title}</Link>
                  )}
                  <span className="versions-meta">
                    <StatusBadge status={v.status} />
                    <time dateTime={v.lastEdited}>{monthYear(v.lastEdited)}</time>
                    {v.slug === t.slug && <span className="muted">· you are here</span>}
                  </span>
                </li>
              ))}
            </ol>
          </nav>
        )}
      </header>

      {t.notes > 0 && (
        <p className="notes-hint">
          Underlined words and numbered markers have translator’s notes — tap one to read it. All notes are also listed at the end.
        </p>
      )}
      <div className="lyrics" dangerouslySetInnerHTML={{ __html: getBody(t.slug) }} />
      {t.notes > 0 && <NotePopover />}

    </article>
  );
}

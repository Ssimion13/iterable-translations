import Link from "next/link";
import { artistName, versionsOf, type Translation } from "@/lib/catalog";
import { StatusBadge } from "./StatusBadge";

export function TranslationCard({ t, showArtist = true }: { t: Translation; showArtist?: boolean }) {
  return (
    <li className="card">
      <Link href={`/songs/${t.slug}`} className="card-link">
        <span className="card-title">{t.title}</span>
        {t.titleJa && <span className="card-ja" lang="ja">{t.titleJa}</span>}
        {showArtist && <span className="card-artist">{artistName(t.artist ?? "unsorted")}</span>}
        <span className="card-desc">{t.description}</span>
        <span className="card-tags">
          <StatusBadge status={t.status} />
          {t.nsfw && <span className="badge badge-nsfw">NSFW</span>}
          {t.notes > 0 && <span className="badge badge-notes">{t.notes} note{t.notes === 1 ? "" : "s"}</span>}
          {versionsOf(t).length > 0 && <span className="badge badge-versions">{versionsOf(t).length} versions</span>}
          <span className="card-date">Edited {t.lastEdited.slice(0, 4)}</span>
        </span>
      </Link>
    </li>
  );
}

export function CardGrid({ items, showArtist }: { items: Translation[]; showArtist?: boolean }) {
  return (
    <ul className="card-grid">
      {items.map((t) => (
        <TranslationCard key={t.slug} t={t} showArtist={showArtist} />
      ))}
    </ul>
  );
}

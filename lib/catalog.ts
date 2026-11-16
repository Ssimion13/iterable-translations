import fs from "node:fs";
import path from "node:path";
import {
  ARTISTS,
  ORIGINALS,
  TRANSLATIONS,
  type Status,
  type Translation,
} from "@/content/catalog";

export { ARTISTS, ORIGINALS };
export type { Status, Translation };

/** Pages for these statuses are not generated (lyrics with no translation). */
const HIDDEN: Status[] = ["untranslated"];

export const published = TRANSLATIONS.filter((t) => !HIDDEN.includes(t.status));

const collator = new Intl.Collator("en", { sensitivity: "base", numeric: true });
export const byTitle = (a: Translation, b: Translation) => collator.compare(a.title, b.title);

export function getTranslation(slug: string) {
  return published.find((t) => t.slug === slug);
}

export function getBody(slug: string): string {
  return fs.readFileSync(path.join(process.cwd(), "content", "translations", `${slug}.html`), "utf8");
}

/** Other versions (drafts / alternates) of the same lyrics. */
export function versionsOf(t: Translation) {
  if (!t.song) return [];
  return published.filter((o) => o.song === t.song && o.slug !== t.slug);
}

export const UNSORTED_ARTIST = "unsorted";

export function artistKeys() {
  const keys = new Set(published.map((t) => t.artist ?? UNSORTED_ARTIST));
  return [...keys].sort((a, b) => {
    if (a === UNSORTED_ARTIST) return 1;
    if (b === UNSORTED_ARTIST) return -1;
    return collator.compare(ARTISTS[a].name, ARTISTS[b].name);
  });
}

export function artistName(key: string) {
  return key === UNSORTED_ARTIST ? "Artist not recorded yet" : ARTISTS[key]?.name ?? key;
}

export function byArtist(key: string) {
  return published
    .filter((t) => (t.artist ?? UNSORTED_ARTIST) === key)
    .sort(byTitle);
}

export function originalKeys() {
  const keys = new Set(published.flatMap((t) => (t.original ? [t.original] : [])));
  return [...keys].sort((a, b) => byOriginal(b).length - byOriginal(a).length || collator.compare(ORIGINALS[a].titleEn, ORIGINALS[b].titleEn));
}

export function byOriginal(key: string) {
  return published.filter((t) => t.original === key).sort(byTitle);
}

export const STATUS_LABEL: Record<Status, string> = {
  complete: "Complete",
  partial: "Incomplete",
  rough: "Needs revision",
  draft: "Older draft",
  untranslated: "Untranslated",
};

export const STATUS_NOTE: Record<Status, string> = {
  complete: "",
  partial: "Parts of this song haven't been translated yet.",
  rough: "This translation was flagged for revision — expect rough or uncertain lines.",
  draft: "This is an older version. A newer translation of this song is linked below.",
  untranslated: "",
};

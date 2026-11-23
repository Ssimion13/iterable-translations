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

/** Every translation that gets a page (NSFW included). */
export const published = TRANSLATIONS.filter((t) => !HIDDEN.includes(t.status));
/** What the general listings show — NSFW songs live only in the NSFW section. */
export const listed = published.filter((t) => !t.nsfw);
/** The NSFW section. */
export const nsfwList = published.filter((t) => t.nsfw);

const collator = new Intl.Collator("en", { sensitivity: "base", numeric: true });
export const byTitle = (a: Translation, b: Translation) => collator.compare(a.title, b.title);

export function getTranslation(slug: string) {
  return published.find((t) => t.slug === slug);
}

export function getBody(slug: string): string {
  return fs.readFileSync(path.join(process.cwd(), "content", "translations", `${slug}.html`), "utf8");
}

/** Every version of the same lyrics (including `t`), newest edit first. Empty if there's only one. */
export function versionsOf(t: Translation) {
  if (!t.song) return [];
  const all = published.filter((o) => o.song === t.song);
  return all.length > 1 ? all.sort((a, b) => b.lastEdited.localeCompare(a.lastEdited)) : [];
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** "2022-08-26" -> "Aug 2022" */
export function monthYear(iso: string) {
  const [y, m] = iso.split("-");
  return `${MONTHS[Number(m) - 1]} ${y}`;
}
/** A date range of notes, e.g. "Mar–Apr 2022" or "Mar 2022 – Oct 2023". */
export function monthRange([a, b]: [string, string]) {
  const [fa, fb] = [monthYear(a), monthYear(b)];
  if (fa === fb) return fa;
  if (a.slice(0, 4) === b.slice(0, 4)) return `${fa.slice(0, 3)}–${fb}`;
  return `${fa} – ${fb}`;
}

export const UNSORTED_ARTIST = "unsorted";

export function artistKeys() {
  const keys = new Set(listed.map((t) => t.artist ?? UNSORTED_ARTIST));
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
  return listed
    .filter((t) => (t.artist ?? UNSORTED_ARTIST) === key)
    .sort(byTitle);
}

export function originalKeys() {
  const keys = new Set(listed.flatMap((t) => (t.original ? [t.original] : [])));
  return [...keys].sort((a, b) => byOriginal(b).length - byOriginal(a).length || collator.compare(ORIGINALS[a].titleEn, ORIGINALS[b].titleEn));
}

export function byOriginal(key: string) {
  return listed.filter((t) => t.original === key).sort(byTitle);
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
  draft: "This is an older version — see the list of versions below for the newer one.",
  untranslated: "",
};

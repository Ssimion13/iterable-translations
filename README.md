# Translations site

A Next.js (App Router) site that hosts song lyric translations. Every page is generated
at build time, so it works on any Node host (Vercel, Netlify, a VPS) or, with one config
line, as a plain static site.

## Running it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

Static hosting (GitHub Pages, Cloudflare Pages, S3…): uncomment `output: "export"` in
`next.config.ts`, run `npm run build`, and upload the `out/` folder.

## URLs

| URL | What it shows |
| --- | --- |
| `/` | Landing page (placeholder — `app/page.tsx`) |
| `/songs` | Every translation, as cards |
| `/songs/<slug>` | One translation, e.g. `/songs/koboresakura` |
| `/artists`, `/artists/<key>` | Grouped by artist/circle, e.g. `/artists/yuuhei-satellite` |
| `/originals`, `/originals/<key>` | Arranges grouped by the tune they're based on, e.g. `/originals/border-of-life` |

## Where things live

- `content/catalog.ts` — **the file you'll edit most.** Titles, artist, original song,
  status (`complete` / `partial` / `rough` / `draft` / `untranslated`) and the card
  description for every translation, plus the lists of artists and original songs.
  - Changing a translation's `slug` changes its URL.
  - Give two entries the same `song` key to link them as versions of each other.
  - Give an entry an `original` key to put it on that original song's page.
  - Entries with `status: "untranslated"` get no page.
  - `notes` is the number of translator's notes in the body (from the Google Docs comments).
- `content/translations/<slug>.html` — the lyrics/translation body, converted from the
  original .docx files. Translator's notes are `<a class="note-ref">` markers (with the
  commented words wrapped in `<span class="anno">`) plus a `<section class="notes">` list
  at the end; the popup reads its text from that list. Converted from the
  original .docx files. Plain HTML: edit freely. Cells/paragraphs with `class="ja"` get
  Japanese styling.
- `public/media/<slug>/` — images that were embedded in the documents.
- `components/SiteHeader.tsx` — the hamburger menu; edit the `NAV` list to change it.
- `app/globals.css` — all styling. On screens narrower than 720px the side-by-side lyric
  tables stack into one column.

## Adding a new translation

1. Write `content/translations/my-song.html` (or convert a .docx with
   `pandoc my-song.docx -t html5 -o content/translations/my-song.html`).
2. Add an entry to `TRANSLATIONS` in `content/catalog.ts` with `slug: "my-song"`.

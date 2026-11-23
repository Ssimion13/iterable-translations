import Link from "next/link";
import { listed, originalKeys, artistKeys } from "@/lib/catalog";

// Landing page — placeholder content, to be written later.
export default function Home() {
  return (
    <article className="landing">
      <h1>Translations</h1>
      <p className="lede">
        {/* TODO: introduction */}
        An introduction will go here.
      </p>
      <ul className="landing-links">
        <li>
          <Link href="/songs">All translations</Link>
          <span>{listed.length} songs</span>
        </li>
        <li>
          <Link href="/artists">Browse by artist</Link>
          <span>{artistKeys().length} artists &amp; circles</span>
        </li>
        <li>
          <Link href="/originals">Browse by original song</Link>
          <span>{originalKeys().length} original tunes</span>
        </li>
      </ul>
    </article>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ARTISTS, UNSORTED_ARTIST, artistKeys, artistName, byArtist } from "@/lib/catalog";

export const metadata: Metadata = { title: "Artists" };

export default function ArtistsPage() {
  return (
    <>
      <h1>Artists &amp; circles</h1>
      <ul className="index-list">
        {artistKeys().map((k) => (
          <li key={k} className={k === UNSORTED_ARTIST ? "unsorted" : undefined}>
            <Link href={`/artists/${k}`}>
              <span>{artistName(k)}</span>
              {ARTISTS[k]?.nameJa && <span className="index-ja" lang="ja">{ARTISTS[k].nameJa}</span>}
            </Link>
            <span className="count">{byArtist(k).length}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

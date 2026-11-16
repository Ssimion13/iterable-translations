import type { Metadata } from "next";
import Link from "next/link";
import { ORIGINALS, byOriginal, originalKeys } from "@/lib/catalog";

export const metadata: Metadata = { title: "Original songs" };

export default function OriginalsPage() {
  return (
    <>
      <h1>By original song</h1>
      <p className="muted">Arranges grouped by the tune they’re based on.</p>
      <ul className="index-list">
        {originalKeys().map((k) => (
          <li key={k}>
            <Link href={`/originals/${k}`}>
              <span>{ORIGINALS[k].titleEn}</span>
              <span className="index-ja" lang="ja">{ORIGINALS[k].title}</span>
              <span className="index-sub">{ORIGINALS[k].source}</span>
            </Link>
            <span className="count">{byOriginal(k).length}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

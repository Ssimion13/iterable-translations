"use client";

import { useEffect, useRef, useState } from "react";

type Open = { n: string; html: string; top: number; left: number; sheet: boolean };

/**
 * Turns the numbered note markers in a translation into tap-to-read popups.
 * Without JavaScript the markers still work as plain links to the list of notes.
 */
export function NotePopover() {
  const [open, setOpen] = useState<Open | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const show = (n: string, anchor: Element) => {
      const li = document.getElementById(`note-${n}`);
      const text = li?.querySelector(".note-text");
      if (!text) return false;
      const r = anchor.getBoundingClientRect();
      const sheet = window.innerWidth < 720;
      const width = 340;
      setOpen({
        n,
        html: text.innerHTML,
        top: r.bottom + window.scrollY + 8,
        left: Math.max(16, Math.min(r.left + window.scrollX - 20, window.scrollX + window.innerWidth - width - 16)),
        sheet,
      });
      document.querySelectorAll(".anno.is-active").forEach((el) => el.classList.remove("is-active"));
      document.querySelectorAll(`.anno[data-note="${n}"]`).forEach((el) => el.classList.add("is-active"));
      return true;
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as Element;
      if (boxRef.current?.contains(target)) return;
      const ref = target.closest(".lyrics .note-ref");
      const anno = target.closest(".lyrics .anno");
      if (ref || anno) {
        if (target.closest("a") && !ref) return; // real links inside highlighted text keep working
        const n = ref ? ref.getAttribute("href")!.replace("#note-", "") : anno!.getAttribute("data-note")!;
        if (show(n, ref ?? anno!)) e.preventDefault();
        return;
      }
      close();
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    const close = () => {
      setOpen(null);
      document.querySelectorAll(".anno.is-active").forEach((el) => el.classList.remove("is-active"));
    };

    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (open) boxRef.current?.focus();
  }, [open]);

  if (!open) return null;
  return (
    <div
      ref={boxRef}
      className={`note-pop${open.sheet ? " is-sheet" : ""}`}
      style={open.sheet ? undefined : { top: open.top, left: open.left }}
      role="dialog"
      aria-label={`Translator's note ${open.n}`}
      tabIndex={-1}
    >
      <div className="note-pop-head">
        <span>Note {open.n}</span>
        <button
          type="button"
          aria-label="Close note"
          onClick={() => {
            setOpen(null);
            document.querySelectorAll(".anno.is-active").forEach((el) => el.classList.remove("is-active"));
          }}
        >
          ×
        </button>
      </div>
      <div className="note-pop-body" dangerouslySetInnerHTML={{ __html: open.html }} />
    </div>
  );
}

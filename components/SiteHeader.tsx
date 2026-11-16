"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

// Menu entries — add, remove or reorder freely.
const NAV = [
  { href: "/", label: "Home" },
  { href: "/songs", label: "All translations" },
  { href: "/artists", label: "By artist" },
  { href: "/originals", label: "By original song" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="site-name">
          Translations
        </Link>
        <button
          className="menu-button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className={`burger${open ? " is-open" : ""}`} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>
    </header>
      {open && <div className="menu-backdrop" onClick={() => setOpen(false)} />}
      <nav id="site-menu" className={`site-menu${open ? " is-open" : ""}`} aria-hidden={!open}>
        <ul>
          {NAV.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                tabIndex={open ? 0 : -1}
                aria-current={pathname === n.href ? "page" : undefined}
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

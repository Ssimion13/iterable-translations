import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Translations", template: "%s · Translations" },
  description: "Song lyric translations — Touhou arranges, anime and more.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#16151a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main className="page">{children}</main>
        <footer className="site-footer">
          <p>
            Translations by AeroReborn (<a href="mailto:aeroreborn@gmail.com">aeroreborn@gmail.com</a>).
          </p>
          <p>
            Translations are fan work, shared for study. The songs and lyrics are not my property — they belong to
            their original artists and are posted only to help people understand them. If you’re a creator and would
            rather your work not appear here, please <a href="mailto:aeroreborn@gmail.com">email me</a> and I’ll take it
            down.
          </p>
        </footer>
      </body>
    </html>
  );
}

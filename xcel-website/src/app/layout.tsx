import type { Metadata, Viewport } from "next";
import { Geist_Mono, Mona_Sans } from "next/font/google";
import localFont from "next/font/local";
import ChatMount from "@/components/ChatMount";
import Footer from "@/components/Footer";
import Sprite from "@/components/Sprite";
import { Reveals, SiteHeader } from "@/components/SiteChrome";
import "./globals.css";

// Hero and top bar: Mona Sans (width axis) and Geist Mono. Everything after the hero: Zen Kaku Gothic New.
const monaSans = Mona_Sans({ variable: "--font-mona-sans", subsets: ["latin"], axes: ["wdth"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
/* Zen Kaku Gothic New is a Japanese family: through next/font/google it shipped ~120 unicode slices per weight,
   484 @font-face rules (357 KB of render-blocking CSS) and 312 preloaded files (3.6 MB) on every page, though the
   site only sets Latin text. These are Google's own Latin slices of the same font (identical glyphs and metrics),
   one ~9.6 KB file per weight, self-hosted. SIL Open Font License 1.1. */
const zen = localFont({
  variable: "--font-zen",
  display: "swap",
  src: [
    { path: "../fonts/zen-kaku-gothic-new-300-latin.woff2", weight: "300", style: "normal" },
    { path: "../fonts/zen-kaku-gothic-new-400-latin.woff2", weight: "400", style: "normal" },
    { path: "../fonts/zen-kaku-gothic-new-500-latin.woff2", weight: "500", style: "normal" },
    { path: "../fonts/zen-kaku-gothic-new-700-latin.woff2", weight: "700", style: "normal" },
  ],
});

// Until launch the site must not be indexed (staging). Set NEXT_PUBLIC_INDEXABLE=true on the production deploy.
const indexable = process.env.NEXT_PUBLIC_INDEXABLE === "true";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://xcelcareers.com"),
  title: { default: "XcelCareers | Healthcare staffing and government contracting", template: "%s | XcelCareers" },
  description:
    "XcelCareers is a Maryland minority veteran-owned staffing company: healthcare staffing first, then government contracting and IT, finance and cybersecurity specialists.",
  robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#101012", colorScheme: "dark" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${monaSans.variable} ${geistMono.variable} ${zen.variable}`}>
      <body className="pg-body">
        <Sprite />
        <SiteHeader />
        {children}
        <Footer />
        <div className="grain grain-tex is-on" aria-hidden="true" />
        <Reveals />
        <ChatMount />
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import { Geist_Mono, Mona_Sans, Zen_Kaku_Gothic_New } from "next/font/google";
import Footer from "@/components/Footer";
import Sprite from "@/components/Sprite";
import { Reveals, SiteHeader } from "@/components/SiteChrome";
import "./globals.css";

// Hero and top bar: Mona Sans (width axis) and Geist Mono. Everything after the hero: Zen Kaku Gothic New.
const monaSans = Mona_Sans({ variable: "--font-mona-sans", subsets: ["latin"], axes: ["wdth"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const zen = Zen_Kaku_Gothic_New({ variable: "--font-zen", subsets: ["latin"], weight: ["300", "400", "500", "700"], display: "swap" });

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
      </body>
    </html>
  );
}

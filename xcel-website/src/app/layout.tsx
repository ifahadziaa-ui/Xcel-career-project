import type { Metadata, Viewport } from "next";
import { Geist_Mono, Mona_Sans } from "next/font/google";
import localFont from "next/font/local";
import IconSprite from "@/components/shared/IconSprite";
import MotionSync from "@/components/shared/MotionSync";
import LenisController from "@/components/shell/LenisController";
import SiteHeader from "@/components/shell/SiteHeader";
import SiteFooter from "@/components/shell/SiteFooter";
import Chat from "@/components/chat/Chat";
import { MOTION_INIT_SCRIPT } from "@/lib/motion/script";
import "./globals.css";

// Display face of the hero headline. Variable font: the hero uses width 75
// (condensed) at weight 900, so the width axis is loaded.
const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

// Mono face of the hero's labels and navigation, and the --font-bar token
// (the top bar, ledger dates, table figures).
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

// The site's running face: --font-sans, --font-display and --font-mono all resolve to it
// (src/styles/tokens.css). Self-hosted: four Latin-only WOFF2 files (about 10 KB each), the
// same files Google Fonts serves for the Latin range, under the SIL OFL (licence and notes in
// src/fonts/zen-kaku-gothic-new/). next/font/google shipped ~485 @font-face rules and ~490
// font files for this family (it is split into Japanese slices), hence the local files.
// preload is off: nothing in the hero uses it. Turn it on when below-the-fold text lands if
// the swap from the metric-adjusted fallback is noticeable.
const zenKaku = localFont({
  variable: "--font-zen-kaku",
  display: "swap",
  preload: false,
  src: [
    { path: "../fonts/zen-kaku-gothic-new/ZenKakuGothicNew-300-latin.woff2", weight: "300", style: "normal" },
    { path: "../fonts/zen-kaku-gothic-new/ZenKakuGothicNew-400-latin.woff2", weight: "400", style: "normal" },
    { path: "../fonts/zen-kaku-gothic-new/ZenKakuGothicNew-500-latin.woff2", weight: "500", style: "normal" },
    { path: "../fonts/zen-kaku-gothic-new/ZenKakuGothicNew-700-latin.woff2", weight: "700", style: "normal" },
  ],
});

// Wording from the cleaned prototype (landing-prototype-clean/index.html), claims checked
// against docs/CLAIMS-REGISTER.md: the certificate is stated on its own and is not placed
// next to the veteran-owned self-description.
export const metadata: Metadata = {
  title: {
    default: "XcelCareers | Healthcare Staffing & Government Contracting in Maryland",
    template: "%s | XcelCareers",
  },
  description:
    "A healthcare staffing and government contracting company in Dayton, Maryland. Maryland MBE, DBE and SBE certified, No. 19-286. CAGE 89AK6.",
};

export const viewport: Viewport = {
  themeColor: "#101012",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-motion is written by the inline script before first paint (and by MotionSync);
    // the server always renders "playing", so React must accept the DOM value.
    <html
      lang="en"
      data-motion="playing"
      suppressHydrationWarning
      className={`${monaSans.variable} ${geistMono.variable} ${zenKaku.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: MOTION_INIT_SCRIPT }} />
      </head>
      <body>
        <IconSprite />
        <MotionSync />
        <LenisController />
        <SiteHeader />
        {children}
        <SiteFooter />
        <Chat />
      </body>
    </html>
  );
}

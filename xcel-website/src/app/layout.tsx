import type { Metadata, Viewport } from "next";
import { Geist_Mono, Mona_Sans, Zen_Kaku_Gothic_New } from "next/font/google";
import IconSprite from "@/components/shared/IconSprite";
import MotionSync from "@/components/shared/MotionSync";
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
// (src/styles/tokens.css). Not a variable font on Google Fonts, so the weights are listed.
// preload is off on purpose: Google's CSS for this family is split into ~80 numbered
// Japanese slices per weight that next/font cannot map to the "latin" subset, so with
// preload on it emitted 312 <link rel="preload"> tags. Without it the browser fetches only
// the slices whose unicode-range matches the characters on the page (see docs/FOUNDATIONS.md).
const zenKaku = Zen_Kaku_Gothic_New({
  variable: "--font-zen-kaku",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  preload: false,
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
        {children}
      </body>
    </html>
  );
}

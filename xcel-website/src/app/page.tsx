import type { Metadata } from "next";
import { Mona_Sans } from "next/font/google";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: { absolute: "XcelCareers | Healthcare staffing and government contracting in Maryland" },
  description:
    "XcelCareers places nurses, care staff and IT, finance and cybersecurity specialists with hospitals, clinics and government agencies. Minority veteran-owned, Maryland MBE, DBE and SBE certified.",
};

// Mona Sans (width axis) sets only the home hero's title and intro, so it is declared here: the
// file (~96 KB) is preloaded on the home page only, not on every page.
const monaSans = Mona_Sans({ variable: "--font-mona-sans", subsets: ["latin"], axes: ["wdth"], display: "swap" });

export default function Home() {
  return <HomeClient className={monaSans.variable} />;
}

import type { Metadata } from "next";
import RoutePlaceholder from "@/components/shell/RoutePlaceholder";

// TEMPORARY placeholder route (Stage 2); not indexable until the real page exists.
export const metadata: Metadata = { title: "IT, Finance & Cyber Specialists", robots: { index: false, follow: false } };

export default function Page() {
  return <RoutePlaceholder title="IT, Finance & Cyber Specialists" path="/it-finance-cyber" />;
}

import type { Metadata } from "next";
import RoutePlaceholder from "@/components/shell/RoutePlaceholder";

// TEMPORARY placeholder route (Stage 2); not indexable until the real page exists.
export const metadata: Metadata = { title: "About", robots: { index: false, follow: false } };

export default function Page() {
  return <RoutePlaceholder title="About" path="/about" />;
}

import type { Metadata } from "next";
import RoutePlaceholder from "@/components/shell/RoutePlaceholder";

// TEMPORARY placeholder route (Stage 2); not indexable until the real page exists.
export const metadata: Metadata = { title: "Capability Statement", robots: { index: false, follow: false } };

export default function Page() {
  return <RoutePlaceholder title="Capability Statement" path="/capability" />;
}

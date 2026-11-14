import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Healthcare staffing",
  description: "Credentialed clinical and non-clinical staff for hospitals, clinics, long-term care, behavioral health providers, and county and state health and human services departments.",
};

export default function Page() {
  return <ServicePage pageKey="healthcare" />;
}

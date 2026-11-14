import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "IT, finance and cybersecurity specialists",
  description: "Specialists behind care and government: healthcare and government IT, finance, cybersecurity cleared up to TS/SCI, and delivery roles.",
};

export default function Page() {
  return <ServicePage pageKey="specialists" />;
}

import type { Metadata } from "next";
import ServicePage from "@/components/ServicePage";

export const metadata: Metadata = {
  title: "Government contracting",
  description: "A certified small-business partner, ready to prime or subcontract at the local, state and federal level: staff augmentation, contract staffing, task orders and IDIQ.",
};

export default function Page() {
  return <ServicePage pageKey="government" />;
}

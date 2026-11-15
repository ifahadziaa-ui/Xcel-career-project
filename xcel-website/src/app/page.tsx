import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";

export const metadata: Metadata = {
  title: { absolute: "XcelCareers | Healthcare staffing and government contracting in Maryland" },
  description:
    "XcelCareers places nurses, care staff and IT, finance and cybersecurity specialists with hospitals, clinics and government agencies. Minority veteran-owned, Maryland MBE, DBE and SBE certified.",
};

export default function Home() {
  return <HomeClient />;
}

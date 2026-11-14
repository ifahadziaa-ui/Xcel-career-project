import Hero from "@/components/hero/Hero";
import Certifications from "@/components/home/Certifications";
import ShowreelPlaceholder from "@/components/home/ShowreelPlaceholder";
import Process from "@/components/home/Process";
import Jobs from "@/components/home/Jobs";
import Capability from "@/components/home/Capability";
import Record from "@/components/home/Record";
import Faq from "@/components/home/Faq";
import ContactSection from "@/components/home/ContactSection";

// Section order from the cleaned prototype: hero, certifications, showreel, process, example roles,
// capability, record, FAQ, contact (the footer is in the root layout).
export default function Home() {
  return (
    <main>
      <Hero />
      <Certifications />
      <ShowreelPlaceholder />
      <Process />
      <Jobs />
      <Capability />
      <Record />
      <Faq />
      <ContactSection />
    </main>
  );
}

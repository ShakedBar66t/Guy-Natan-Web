import Hero from "@/components/Hero";
import ProgramsSection from "@/components/ProgramSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import KnowledgeSection from "@/components/KnowledgeSection";
import FinancialUpdatesSection from "@/components/FinancialUpdatesSection";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <Hero />
      <ProgramsSection />
      <TestimonialsSection />
      <KnowledgeSection />
      <FinancialUpdatesSection />
    </main>
  )
}

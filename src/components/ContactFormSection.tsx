"use client";

import ContactForm from "@/components/ContactForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function ContactFormSection() {
  return (
    <MaxWidthWrapper className="my-10 sm:my-16">
      <div className="w-full bg-[#50D3C5] py-10 sm:py-16 rounded-xl">
        <h2 className="text-center text-3xl sm:text-4xl md:text-5xl mb-6 sm:mb-10">
          לקבלת פרטים נוספים עבור תוכנית ההכשרה
        </h2>
        <div className="max-w-4xl mx-auto px-4">
          <ContactForm 
            source="global_footer_section"
            className="bg-transparent shadow-none"
            showMessageField={false}
            title=""
            tealBackground={true}
          />
        </div>
      </div>
    </MaxWidthWrapper>
  );
} 
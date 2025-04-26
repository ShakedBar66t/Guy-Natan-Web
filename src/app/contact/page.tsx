"use client";

import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <>
      <div className="bg-[#002F42] py-6 mb-16">
        <MaxWidthWrapper>
          <h1 className="text-white text-center text-5xl md:text-6xl font-bold mb-2">
            דברו <span className="font-normal">איתנו</span>
          </h1>
        </MaxWidthWrapper>
      </div>

      <MaxWidthWrapper>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <ContactForm 
            source="contact_page"
            title="השאירו פרטים ונחזור אליכם"
            showEmailField={true}
            showMessageField={true}
            inline={false}
          />

          {/* Contact Information */}
          <div className="flex flex-col justify-between">
            <div className="space-y-8">
              <div className="flex items-center rtl">
                <div className="bg-[#002F42] rounded-full p-4 mr-4">
                  <FaEnvelope className="text-white text-xl" />
                </div>
                <div className="pr-2">
                  <h3 className="text-lg text-gray-500 mb-1">דוא״ל</h3>
                  <a 
                    href="mailto:office@guynatan.com"
                    className="text-xl text-[#002F42] hover:text-[#32a191] transition-colors"
                  >
                    office@guynatan.com
                  </a>
                </div>
              </div>

              <div className="flex items-center rtl">
                <div className="bg-[#002F42] rounded-full p-4 mr-4">
                  <FaPhone className="text-white text-xl" />
                </div>
                <div className="pr-2">
                  <h3 className="text-lg text-gray-500 mb-1">טלפון</h3>
                  <a 
                    href="tel:054-571-0816"
                    className="text-xl text-[#002F42] hover:text-[#32a191] transition-colors"
                  >
                    054-571-0816
                  </a>
                </div>
              </div>
              <div className="flex items-center rtl ">
                <div className="bg-[#002F42] rounded-full p-4 mr-4">
                  <FaMapMarkerAlt className="text-white text-xl" />
                </div>
                <div className="pr-2">
                  <h3 className="text-lg text-gray-500 mb-1">משרד</h3>
                  <p className="text-xl text-[#002F42]">
                    בניין רסיטל מנחם בגין 156, תל אביב
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </>
  );
} 
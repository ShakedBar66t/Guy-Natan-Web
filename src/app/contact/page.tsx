"use client";

import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <>
      <style jsx global>{`
        .icon-container {
          transition: all 0.3s ease;
        }
        
        .card-container:hover .icon-container {
          transform: scale(1.1);
          box-shadow: 0 0 15px rgba(50, 161, 145, 0.6);
        }
        
        .card-container:hover .icon {
          transform: rotate(10deg);
        }
        
        .icon {
          transition: transform 0.3s ease;
        }
      `}</style>

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
          <div className="flex flex-col space-y-6">
            {/* Address Card */}
            <div className="border border-gray-300 rounded-lg p-6 flex items-center card-container hover:border-[#32a191] transition-colors" dir="rtl">
              <div className="bg-[#32a191] rounded-full p-4 ml-4 flex-shrink-0 icon-container">
                <FaMapMarkerAlt className="text-white text-xl icon" />
              </div>
              <div className="text-right">
                <p className="text-xl text-[#002F42]">
                  בניין רסיטל מנחם בגין 156, תל אביב
                </p>
              </div>
            </div>

            {/* Phone Card */}
            <div className="border border-gray-300 rounded-lg p-6 flex items-center card-container hover:border-[#32a191] transition-colors" dir="rtl">
              <div className="bg-[#32a191] rounded-full p-4 ml-4 flex-shrink-0 icon-container">
                <FaPhone className="text-white text-xl icon" />
              </div>
              <div className="text-right">
                <a 
                  href="tel:054-571-0816"
                  className="text-xl text-[#002F42] hover:text-[#32a191] transition-colors"
                >
                  054-571-0816
                </a>
              </div>
            </div>

            {/* Email Card */}
            <div className="border border-gray-300 rounded-lg p-6 flex items-center card-container hover:border-[#32a191] transition-colors" dir="rtl">
              <div className="bg-[#32a191] rounded-full p-4 ml-4 flex-shrink-0 icon-container">
                <FaEnvelope className="text-white text-xl icon" />
              </div>
              <div className="text-right">
                <a 
                  href="mailto:office@guynatan.com"
                  className="text-xl text-[#002F42] hover:text-[#32a191] transition-colors"
                >
                  office@guynatan.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </>
  );
} 
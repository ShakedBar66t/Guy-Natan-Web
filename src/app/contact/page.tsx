"use client";

import { useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would connect to a backend
    alert("פרטיך נשלחו בהצלחה! אנו ניצור איתך קשר בהקדם.");
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: ""
    });
  };

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
          <div className="bg-white rounded-lg shadow-lg">
            <h2 className="text-3xl font-bold text-[#002F42] mb-6 text-center">
              השאירו פרטים ונחזור אליכם
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="שם מלא"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  dir="rtl"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="דוא״ל"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  dir="rtl"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="טלפון"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  dir="rtl"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                />
              </div>
              <div>
                <textarea
                  name="message"
                  placeholder="הודעה"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  dir="rtl"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                ></textarea>
              </div>
              <div>
                <button 
                  type="submit"
                  className="w-full bg-[#002F42] text-white font-medium py-3 px-6 rounded-lg hover:bg-[#32a191] transition-colors"
                >
                  שליחה
                </button>
              </div>
            </form>
          </div>

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
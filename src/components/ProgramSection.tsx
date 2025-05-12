"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
import { 
  FaHandshake, 
  FaChartLine, 
  FaUsers, 
  FaBuilding, 
  FaRegChartBar, 
  FaCrown 
} from "react-icons/fa";
import ContactForm from "@/components/ContactForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ContactFormSection from './ContactFormSection';

const programs = [
  {
    id: 'personal',
    title: 'פגישה אישית',
    description: 'אפיון ומעבר על כל המוצרים הפיננסים ו/או בניית תמהיל תיק ממוקד.',
    cta: 'זה מתאים לי',
    href: 'https://api.whatsapp.com/send/?phone=552655305&text=%D7%94%D7%99%D7%99+%D7%92%D7%99%D7%90%2C+%D7%90%D7%A9%D7%9E%D7%97+%D7%9C%D7%A4%D7%A8%D7%98%D7%99%D7%9D+%D7%A2%D7%9C+%D7%94%D7%AA%D7%95%D7%9B%D7%A0%D7%99%D7%AA+%D7%9C%D7%99%D7%95%D7%95%D7%99+%D7%A9%D7%9C%D7%9A&type=phone_number&app_absent=0',
    icon: FaHandshake
  },
  {
    id: 'lazy-inverstor',
    title: 'המשקיע הת׳כלסי',
    description: 'תכנית יעילה וממוקדת, סדר בהשקעות טווח קצר וארוך, מינמום התעסקות ביום יום.',
    cta: 'הגיע הזמן',
    href: 'https://api.whatsapp.com/send/?phone=552655305&text=%D7%94%D7%99%D7%99+%D7%92%D7%99%D7%90%2C+%D7%90%D7%A9%D7%9E%D7%97+%D7%9C%D7%A4%D7%A8%D7%98%D7%99%D7%9D+%D7%A2%D7%9C+%D7%94%D7%AA%D7%95%D7%9B%D7%A0%D7%99%D7%AA+%D7%9C%D7%99%D7%95%D7%95%D7%99+%D7%A9%D7%9C%D7%9A&type=phone_number&app_absent=0',
    icon: FaChartLine
  },
  {
    id: 'couple-investor',
    title: 'הזוג המשקיע',
    description: 'התכנית שמתכננת תקציב משק בית חכם, מלמדת איך לעקוב באמת אחר ההוצאות החודשיות, לשפר תזרים מזומנים, להקטיין חובות, ליצור הון משפחתי לשקט בטווח הרחוק.אפיון ומעבר על כל המוצרים הפיננסים ו/או בניית תמהיל תיק ממוקד.',
    cta: 'אנחנו צריכים את זה',
    href: 'https://api.whatsapp.com/send/?phone=552655305&text=%D7%94%D7%99%D7%99+%D7%92%D7%99%D7%90%2C+%D7%90%D7%A9%D7%9E%D7%97+%D7%9C%D7%A4%D7%A8%D7%98%D7%99%D7%9D+%D7%A2%D7%9C+%D7%94%D7%AA%D7%95%D7%9B%D7%A0%D7%99%D7%AA+%D7%9C%D7%99%D7%95%D7%95%D7%99+%D7%A9%D7%9C%D7%9A&type=phone_number&app_absent=0',
    icon: FaUsers
  },
  {
    id: 'business-owner',
    title: 'העסק הרווחי',
    description: 'התוכנית שעושה ניתוח פיננסי מקיף, מעבר על דו״חות רווח והפסד, כרטסת, שיפור וייעול שולי הרווח ובעיקר מלמדת איך לקחת את המושכות ולהיות בעל עסק בראש שקט.',
    cta: 'אני מחכה לזה',
    href: 'https://api.whatsapp.com/send/?phone=552655305&text=%D7%94%D7%99%D7%99+%D7%92%D7%99%D7%90%2C+%D7%90%D7%A9%D7%9E%D7%97+%D7%9C%D7%A4%D7%A8%D7%98%D7%99%D7%9D+%D7%A2%D7%9C+%D7%94%D7%AA%D7%95%D7%9B%D7%A0%D7%99%D7%AA+%D7%9C%D7%99%D7%95%D7%95%D7%99+%D7%A9%D7%9C%D7%9A&type=phone_number&app_absent=0',
    icon: FaBuilding
  },
  {
    id: 'active-investor',
    title: 'המשקיע האקטיבי',
    description: 'תכנית שתאפשר לכם לנתח מגמות בשוק ההון, כולל כל מה שנלמד ב״משקיע הת׳כלסי״, אבל כאלה שמוכנים ל- Next-Step בעולם המסחר האקטיבי.',
    cta: 'זה בדיוק אני',
    href: 'https://api.whatsapp.com/send/?phone=552655305&text=%D7%94%D7%99%D7%99+%D7%92%D7%99%D7%90%2C+%D7%90%D7%A9%D7%9E%D7%97+%D7%9C%D7%A4%D7%A8%D7%98%D7%99%D7%9D+%D7%A2%D7%9C+%D7%94%D7%AA%D7%95%D7%9B%D7%A0%D7%99%D7%AA+%D7%9C%D7%99%D7%95%D7%95%D7%99+%D7%A9%D7%9C%D7%9A&type=phone_number&app_absent=0',
    icon: FaRegChartBar
  },
  {
    id: 'premium-plan',
    title: 'תוכנית פרימיום',
    description: 'פתוחה רק לבוגרי מסלול ליווי להשקעות ומסלול שוק ההון.',
    cta: 'דרך שירות לקוחות',
    href: 'https://api.whatsapp.com/send/?phone=552655305&text=%D7%94%D7%99%D7%99+%D7%92%D7%99%D7%90%2C+%D7%90%D7%A9%D7%9E%D7%97+%D7%9C%D7%A4%D7%A8%D7%98%D7%99%D7%9D+%D7%A2%D7%9C+%D7%94%D7%AA%D7%95%D7%9B%D7%A0%D7%99%D7%AA+%D7%9C%D7%99%D7%95%D7%95%D7%99+%D7%A9%D7%9C%D7%9A&type=phone_number&app_absent=0',
    icon: FaCrown
  },
];

export default function ProgramsSection() {
  // Add client-side check
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <section id="programs">
      <div className="container mx-auto max-w-5xl px-4">
        <h2 className="text-5xl font-normal text-center mb-8 mt-16">
          אתם בוחרים את התוכנית<br />
          <span className="font-bold">שהכי מתאימה לכם</span>
          <div className="text-center mt-2 mb-12">👇🏻👇🏻👇🏻👇🏻👇🏻</div>
        </h2>
      </div>

      <ContactFormSection />

      <div className="container mx-auto max-w-6xl px-6 sm:px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {programs.map((program) => (
            <div 
              key={program.id} 
              className="bg-white border-2 border-black hover:border-[#32a191] transition-colors duration-300 rounded-lg shadow-md p-4 sm:p-6 flex flex-col h-[350px] sm:h-[450px] relative mx-auto w-full max-w-[320px] md:max-w-none"
              onMouseEnter={() => setHoveredCard(program.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {isMounted && program.icon && (
                <div className="mb-2">
                  {React.createElement(program.icon, {
                    size: 30,
                    className: `text-[#32a191] transition-transform duration-300 ${
                      hoveredCard === program.id ? 'scale-125' : ''
                    }`
                  })}
                </div>
              )}
              <h3 className="text-2xl sm:text-3xl font-[500] mb-2 sm:mb-4">{program.title}</h3>
              <div className="flex-grow overflow-y-auto">
                <p className="text-lg sm:text-xl font-[400]">{program.description}</p>
              </div>
              <div className="mt-4 sm:mt-6">
                <Link 
                  href={program.href}
                  className="flex items-center justify-center text-[#32a191] font-[700] group"
                >
                  <span className="transition-transform duration-300 group-hover:-translate-y-1">{program.cta}</span>
                  <ArrowLeftIcon className="h-5 w-5 mr-1 transition-transform duration-300 group-hover:-translate-y-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

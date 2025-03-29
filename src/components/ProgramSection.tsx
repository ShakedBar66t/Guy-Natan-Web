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

const programs = [
  {
    id: 'personal',
    title: 'פגישה אישית',
    description: 'אפיון ומעבר על כל המוצרים הפיננסים ו/או בניית תמהיל תיק ממוקד.',
    cta: 'זה מתאים לי',
    href: '/contact?program=personal',
    icon: FaHandshake
  },
  {
    id: 'lazy-inverstor',
    title: 'המשקיע הת׳כלסי',
    description: 'תכנית יעילה וממוקדת, סדר בהשקעות טווח קצר וארוך, מינמום התעסקות ביום יום.',
    cta: 'הגיע הזמן',
    href: '/contact?program=personal',
    icon: FaChartLine
  },
  {
    id: 'couple-investor',
    title: 'הזוג המשקיע',
    description: 'התכנית שמתכננת תקציב משק בית חכם, מלמדת איך לעקוב באמת אחר ההוצאות החודשיות, לשפר תזרים מזומנים, להקטיין חובות, ליצור הון משפחתי לשקט בטווח הרחוק.אפיון ומעבר על כל המוצרים הפיננסים ו/או בניית תמהיל תיק ממוקד.',
    cta: 'אנחנו צריכים את זה',
    href: '/contact?program=personal',
    icon: FaUsers
  },
  {
    id: 'business-owner',
    title: 'העסק הרווחי',
    description: 'התוכנית שעושה ניתוח פיננסי מקיף, מעבר על דו״חות רווח והפסד, כרטסת, שיפור וייעול שולי הרווח ובעיקר מלמדת איך לקחת את המושכות ולהיות בעל עסק בראש שקט.',
    cta: 'אני מחכה לזה',
    href: '/contact?program=personal',
    icon: FaBuilding
  },
  {
    id: 'active-investor',
    title: 'המשקיע האקטיבי',
    description: 'תכנית שתאפשר לכם לנתח מגמות בשוק ההון, כולל כל מה שנלמד ב״משקיע הת׳כלסי״, אבל כאלה שמוכנים ל- Next-Step בעולם המסחר האקטיבי.',
    cta: 'זה בדיוק אני',
    href: '/contact?program=personal',
    icon: FaRegChartBar
  },
  {
    id: 'premium-plan',
    title: 'תוכנית פרימיום',
    description: 'פתוחה רק לבוגרי מסלול ליווי להשקעות ומסלול שוק ההון.',
    cta: 'דרך שירות לקוחות',
    href: '/contact?program=personal',
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
    <section>
      <div className="container mx-auto max-w-5xl px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          אתם בוחרים את התוכנית<br />
          <strong>שהכי מתאימה לכם</strong>
          <div className="text-center mt-2 mb-12">👇🏻👇🏻👇🏻👇🏻👇🏻</div>
        </h2>
      </div>

      <div className="w-full bg-[#50D3C5] py-10 sm:py-16 mb-12">
        <div className="container mx-auto max-w-5xl px-4 sm:px-8">
          <h1 className='text-center text-3xl sm:text-4xl md:text-5xl mb-6 sm:mb-10'>
              לקבלת פרטים נוספים עבור תוכנית ההכשרה
          </h1>
          <div className='flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto'>
              <input type="text" className='rounded-lg p-3 font-[300] w-full' placeholder='שם מלא' />
              <input type="text" className='rounded-lg p-3 font-[300] w-full' placeholder='מספר טלפון' />
              <button className='text-white bg-[#002F42] p-3 rounded-lg font-500 w-full sm:w-auto sm:px-8'>שליחה</button>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {programs.map((program) => (
            <div 
              key={program.id} 
              className="bg-white border-2 border-black hover:border-[#32a191] transition-colors duration-300 rounded-lg shadow-md p-8 flex flex-col h-[450px] relative"
              onMouseEnter={() => setHoveredCard(program.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {isMounted && program.icon && (
                <div className="mb-2">
                  {React.createElement(program.icon, {
                    size: 36,
                    className: `text-[#32a191] transition-transform duration-300 ${
                      hoveredCard === program.id ? 'scale-125' : ''
                    }`
                  })}
                </div>
              )}
              <h3 className="text-3xl font-[500] mb-4">{program.title}</h3>
              <div className="flex-grow overflow-y-auto">
                <p className="text-xl font-[400]">{program.description}</p>
              </div>
              <div className="mt-6">
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

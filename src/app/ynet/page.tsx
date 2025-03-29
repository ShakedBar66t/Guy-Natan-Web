'use client';

import { useState } from 'react';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Link from 'next/link';

// Sample YNET articles data
const ynetArticles = [
  {
    id: 1,
    title: 'שרינקפלציה: כך החברות גורמות לנו לשלם יותר - על פחות',
    date: '27.03.2025',
    slug: 'shrinkflation-paying-more-for-less'
  },
  {
    id: 2,
    title: 'בורסה במשבר? ההיסטוריה אומרת בדיוק את ההפך',
    date: '23.03.2025',
    slug: 'stock-market-crisis-history'
  },
  {
    id: 3,
    title: 'השמיים נפתחים מחדש והתיירות הישראלית מתמודדת עם מציאות חדשה',
    date: '16.03.2025',
    slug: 'israeli-tourism-new-reality'
  },
  {
    id: 4,
    title: 'העתיד הכלכלי של ילדיכם מתחיל היום: כך תמקסמו את החיסכון שלהם',
    date: '12.03.2025',
    slug: 'children-financial-future'
  },
  {
    id: 5,
    title: 'האם הכלכלה האמריקאית בדרך למיתון? מלחמת הסחר החדשה של טראמפ',
    date: '09.03.2025',
    slug: 'american-economy-recession-trade-war'
  },
  {
    id: 6,
    title: 'משבר המטוסים העולמי מעצב מחדש את שוק התעופה: אלו הישראליות שנהנות ממנו',
    date: '04.03.2025',
    slug: 'global-aircraft-crisis-israeli-companies'
  },
  {
    id: 7,
    title: 'לאחר השקעות הענק: האם ה-AI מספקת את ההבטחות',
    date: '23.02.2025',
    slug: 'ai-investments-promises'
  },
  {
    id: 8,
    title: 'ענף הביטוח טס לשיאים – ועדיין מתומחר בזול',
    date: '18.02.2025',
    slug: 'insurance-industry-peaks'
  },
  {
    id: 9,
    title: 'מאה אלף ומעלה: כך נעלמו הרכבים הזולים מהשוק הישראלי',
    date: '10.02.2025',
    slug: 'affordable-cars-disappearing'
  },
  {
    id: 10,
    title: 'בעקבות מינוי הרמטכ"ל החדש: המניות הבטחוניות ששווה לשים על הכוונת',
    date: '04.02.2025',
    slug: 'defense-stocks-new-chief-of-staff'
  },
  {
    id: 11,
    title: 'IRA: המוצר שבתי השקעות יעדיפו שלא תכירו',
    date: '29.01.2025',
    slug: 'ira-investment-houses'
  },
  {
    id: 12,
    title: 'משכנתא או שכירות? זמן לחשב מסלול מחדש בדילמה הפיננסית של הישראלים',
    date: '22.01.2025',
    slug: 'mortgage-rent-financial-dilemma'
  },
  {
    id: 13,
    title: 'העלייה הגבוהה ביותר ב-17 שנים: מה עומד מאחורי הקפיצה בתעריפי הארנונה',
    date: '20.01.25',
    slug: 'property-tax-increase'
  },
  {
    id: 14,
    title: 'מינוס בחינוך פיננסי: כמעט 40 אחוז מהישראלים נמצאים באוברדראפט',
    date: '13.01.2025',
    slug: 'financial-education-deficit'
  },
  {
    id: 15,
    title: 'טראמפ 2.0: מי יהיו החברות הישראליות שירוויחו מהממשל החדש',
    date: '27.12.2024',
    slug: 'trump-israeli-companies'
  },
  {
    id: 16,
    title: 'היום שלאחר אסד: ההשפעות הכלכליות הצפויות של קריסת המשטר על האזור',
    date: '13.12.2024',
    slug: 'post-assad-economic-effects'
  },
  {
    id: 17,
    title: 'מחשוב קוונטי: הטכנולוגיה שיכולה לשנות את עולם השקעות הטכנולוגיה',
    date: '25.11.2024',
    slug: 'quantum-computing-tech-investments'
  },
  {
    id: 18,
    title: 'הירקות מתייקרים, הרווחיות עולה: חברת "ביכורי שדה" ניהנת מעליית המחירים',
    date: '07.11.2024',
    slug: 'vegetables-prices-bichrei-sadeh'
  }
];

export default function YnetPage() {
  return (
    <>
      {/* Header Banner */}
      <div className="bg-[#002F42] py-6 mb-8">
        <MaxWidthWrapper>
          <h1 className="text-white text-center text-5xl md:text-6xl font-bold mb-2">
            הטור של גיא נתן <span className="font-semibold text-5xl">ב-Ynet</span>
          </h1>
        </MaxWidthWrapper>
      </div>

      <MaxWidthWrapper>
        {/* Intro Section */}
        <div className="text-center mb-12">
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700" dir="rtl">
              הנגשת ידע בתחום הפיננסי להמונים היא הליבה של העשייה שלנו, 
              כאן תוכלו למצוא כתבות המתפרסמות בשגרה במדור שוק ההון של Ynet ישראל.
            </p>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 mb-16">
          {ynetArticles.map((article) => (
            <div key={article.id} className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden border border-black border-2" dir="rtl">
              {/* YNET Logo */}
              <div className="flex justify-center py-4 bg-gray-200">
                <img 
                  src="https://res.cloudinary.com/drld1bejg/image/upload/v1743282916/ynet-capital-logo_k1z4ip.svg" 
                  alt="YNET Capital Logo" 
                  className="h-8"
                />
              </div>
              
              {/* Article Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-[#002F42] mb-3 hover:text-[#32a191] transition-colors">
                  {article.title}
                </h2>
                <div className="mb-4 text-gray-500 text-sm">
                  <span className="inline-block">
                    <span className="font-medium">{article.date}</span>
                  </span>
                </div>
                <div className="mt-auto">
                  <Link 
                    href={`/ynet/${article.slug}`}
                    className="inline-block bg-[#32a191] text-white px-4 py-2 rounded-lg hover:bg-[#002F42] transition-colors text-sm font-medium"
                  >
                    קראו עוד
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="bg-[#32a191] text-white rounded-lg p-8 mb-16" dir="rtl">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">
              הירשמו לניוזלטר שלנו לקבלת עדכונים על כתבות חדשות
            </h3>
            <p className="text-lg">
              אל תפספסו את המאמרים האחרונים של גיא נתן ב-Ynet ועדכונים פיננסיים חשובים
            </p>
          </div>
          <form className="max-w-md mx-auto flex flex-col md:flex-row gap-4">
            <input
              type="email"
              placeholder="כתובת דוא״ל"
              required
              dir="rtl"
              className="flex-1 p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="bg-white text-[#32a191] font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              הרשמה
            </button>
          </form>
        </div>

        {/* Social Media Updates */}
        <div className="mb-16" dir="rtl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="text-2xl font-bold text-[#002F42] mb-4">איפה תסתיים לדעתכם שנת 2025?</h3>
              <p className="text-gray-700 mb-4">
                אל תגידו לא ידעתי, אל תגידו לא שמעתי 📈💰
              </p>
              <p className="text-sm text-gray-500">
                אין באמור משום ייעוץ ו/או שיווק השקעות ו/או ייעוץ מס ואין בו משום תחליף לשירותים כאמור המתחשבים בנתונים ובצרכים המיוחדים של כל אדם. אין באמור משום המלצה בנוגע לכדאיות השקעה במוצרים או מכשירים פיננסיים כלשהם ואין בדברים משום הזמנה ו/או הצעה לביצוע פעולות במוצרים הנזכרים.
              </p>
            </div>
            
            <div className="bg-gray-100 rounded-lg p-6">
              <h3 className="text-2xl font-bold text-[#002F42] mb-4">הסקטור החם של השנה האחרונה (לצערי) 💰</h3>
              <p className="text-gray-700 mb-4">
                גזרו ושמרו ! 🧠📈
              </p>
              <p className="text-sm text-gray-500">
                פה בדיוק בשביל זה 🧠❤️
              </p>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </>
  );
} 
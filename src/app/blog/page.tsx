'use client';

import { useState } from 'react';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Link from 'next/link';

// Sample blog data - this would be replaced with real data from a CMS
const blogPosts = [
  {
    id: 1,
    title: 'הבורסה הישראלית בזמני משבר – ומה קורה ביום שאחרי?',
    excerpt: 'הבורסה הישראלית חווה ירידות בזמן משברים, אך פעם אחר פעם היא מתאוששת וממשיכה לצמוח, מה שהופך משברים להזדמנויות.',
    date: '28/03/2025',
    category: 'שוק ההון',
    level: 'מתקדמים',
    slug: 'stock-market-crisis'
  },
  {
    id: 2,
    title: 'תורת הערך',
    excerpt: 'שנה לזכרו של דניאל כהנמן: איך תורת הערך שלו מסבירה טעויות בהשקעות, ולמה שנאת הפסד חזקה מרווח?',
    date: '27/03/2025',
    category: 'פיננסים',
    level: 'בינוניים',
    slug: 'value-theory'
  },
  {
    id: 3,
    title: 'סיכום שנת 2024 של חברות הביטוח',
    excerpt: 'שנת 2024 הייתה שנת פריצה לחברות הביטוח בישראל, עם זינוק חד ברווחיות ומדד ת"א ביטוח שהוביל את השוק.',
    date: '27/03/2025',
    category: 'שוק ההון',
    level: 'מתחילים',
    slug: 'insurance-companies-2024'
  },
  {
    id: 4,
    title: 'אני הולך לשנות לכם את החיים',
    excerpt: 'השקעות חכמות מתחילות בידע. שינוי מסלול ודמי ניהול עשויים לחסוך מיליונים. קחו אחריות, תבצעו בדיקות, ותבטיחו עתיד כלכלי טוב.',
    date: '27/03/2025',
    category: 'פיננסים',
    level: 'מתחילים',
    slug: 'change-your-life'
  },
  {
    id: 5,
    title: 'שכר המינימום עולה – האם זה יעכב את הורדות הריבית של בנק ישראל?',
    excerpt: 'העלאת שכר המינימום ב-6% עשויה לגרור עליית מחירים ולעכב הורדת ריבית – האם מישהו לקח בחשבון את ההשלכות?',
    date: '26/03/2025',
    category: 'פיננסים',
    level: 'בינוניים',
    slug: 'minimum-wage-increase'
  },
  {
    id: 6,
    title: 'המגבלות החדשות של בנק ישראל יקררו את שוק הנדל״ן? תחשבו שוב..',
    excerpt: 'המגבלות החדשות של בנק ישראל נועדו לצנן את השוק, אך עשויות דווקא להוביל לזינוק במימון חוץ-בנקאי ולסיכון מוגבר.',
    date: '26/03/2025',
    category: 'נדל"ן',
    level: 'מתקדמים',
    slug: 'bank-of-israel-limitations'
  },
  {
    id: 7,
    title: 'תקציב המדינה לשנת 2025 – מתחת לרדאר של כולם',
    excerpt: 'תקציב המדינה לשנת 2025 שובר שיא של 620 מיליארד ש"ח, עם עלייה דרמטית בביטחון, החינוך והבריאות. האם ישפיע על השווקים?',
    date: '25/03/2025',
    category: 'כלכלה',
    level: 'בינוניים',
    slug: 'state-budget-2025'
  },
  {
    id: 8,
    title: 'איך לקרוא דוחות כספיים בצורה נכונה?',
    excerpt: 'הבנת דוחות כספיים היא מיומנות קריטית למשקיעים. למדו איך לזהות סימני אזהרה והזדמנויות שאחרים מפספסים.',
    date: '24/03/2025',
    category: 'שוק ההון',
    level: 'מתקדמים',
    slug: 'financial-statements'
  },
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  // Get unique categories and levels
  const categories = Array.from(new Set(blogPosts.map(post => post.category)));
  const levels = Array.from(new Set(blogPosts.map(post => post.level)));

  // Filter posts based on selection
  const filteredPosts = blogPosts.filter(post => {
    if (selectedCategory && post.category !== selectedCategory) return false;
    if (selectedLevel && post.level !== selectedLevel) return false;
    return true;
  });

  return (
    <>
      {/* Header Banner */}
      <div className="bg-[#002F42] py-6 mb-8">
        <MaxWidthWrapper>
          <h1 className="text-white text-center text-5xl md:text-6xl font-bold mb-2">
            הבלוג <span className="font-normal">שלנו</span>
          </h1>
        </MaxWidthWrapper>
      </div>

      <MaxWidthWrapper>
        {/* Intro Section */}
        <div className="text-center mb-16">
          <div className="max-w-3xl mx-auto">
            <p className="mb-2 text-lg" dir="rtl">
              אתם רוצים לשנות את העתיד הפיננסי שלכם?<br />
              נמאס לכם לשמוע מושגים ולא להבין מה הם אומרים?<br />
              אתם רוצים ללמוד ולהבין עוד?
            </p>
            <p className="text-xl font-bold text-[#002F42]" dir="rtl">
              הבלוג שלנו זה בדיוק מה שאתם צריכים!
            </p>
          </div>
        </div>

        {/* Filters Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Category Filter */}
          <div className="bg-gray-100 rounded-lg p-8 text-right" dir="rtl">
            <h2 className="text-3xl font-bold text-[#002F42] mb-6">
              מה בא לך <span className="text-[#32a191]">ללמוד?</span>
            </h2>
            <div className="mb-4">
              <h3 className="text-xl font-medium mb-4">קטגוריה</h3>
              <div className="space-y-3">
                <button 
                  className={`block w-full text-right px-4 py-2 rounded-md ${selectedCategory === null ? 'bg-[#32a191] text-white' : 'bg-white hover:bg-gray-50'}`}
                  onClick={() => setSelectedCategory(null)}
                >
                  הכל
                </button>
                {categories.map((category) => (
                  <button 
                    key={category}
                    className={`block w-full text-right px-4 py-2 rounded-md ${selectedCategory === category ? 'bg-[#32a191] text-white' : 'bg-white hover:bg-gray-50'}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Level Filter */}
          <div className="bg-gray-100 rounded-lg p-8 text-right" dir="rtl">
            <h2 className="text-3xl font-bold text-[#002F42] mb-6">
              מה הרמה <span className="text-[#32a191]">שלך?</span>
            </h2>
            <div className="mb-4">
              <h3 className="text-xl font-medium mb-4">רמה</h3>
              <div className="space-y-3">
                <button 
                  className={`block w-full text-right px-4 py-2 rounded-md ${selectedLevel === null ? 'bg-[#32a191] text-white' : 'bg-white hover:bg-gray-50'}`}
                  onClick={() => setSelectedLevel(null)}
                >
                  הכל
                </button>
                {levels.map((level) => (
                  <button 
                    key={level}
                    className={`block w-full text-right px-4 py-2 rounded-md ${selectedLevel === level ? 'bg-[#32a191] text-white' : 'bg-white hover:bg-gray-50'}`}
                    onClick={() => setSelectedLevel(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
              {/* Post Content */}
              <div className="p-6 flex flex-col flex-grow text-right" dir="rtl">
                <h2 className="text-xl font-bold text-[#002F42] mb-4 min-h-[3rem] line-clamp-2 hover:text-[#32a191] transition-colors">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>
                <div className="mb-4 text-gray-500 text-sm">
                  <span className="inline-block">
                    <span className="font-bold">{post.date}</span>
                  </span>
                </div>
                <p className="text-gray-700 mb-4 flex-grow">{post.excerpt}</p>
                <div className="flex justify-start">
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="inline-block text-[#32a191] font-medium hover:text-[#002F42] transition-colors"
                  >
                    קרא עוד {'>>'} 
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
              הירשמו לניוזלטר שלנו לקבלת עדכונים על מאמרים חדשים
            </h3>
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
      </MaxWidthWrapper>
    </>
  );
} 
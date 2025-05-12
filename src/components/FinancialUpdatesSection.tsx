"use client";

import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import ContactForm from "@/components/ContactForm";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

// FAQ data with questions and answers
const faqItems = [
    {
        id: 1,
        question: 'האם אני באמת צריך ליווי פיננסי?',
        answer: 'ליווי פיננסי הוא כלי חשוב עבור כל מי שרוצה לשפר את מצבו הכלכלי ולהשיג יעדים פיננסיים. העבודה עם יועץ מקצועי מאפשרת לך לקבל תמונה ברורה על המצב הפיננסי שלך, לזהות הזדמנויות שאולי פספסת, ולבנות תכנית פעולה מותאמת אישית. המטרה היא לא רק להגדיל את ההכנסות, אלא גם ליצור ביטחון כלכלי לטווח הארוך.'
    },
    {
        id: 2,
        question: 'כמה זמן לוקח לראות תוצאות?',
        answer: 'התשובה משתנה בהתאם למצב ההתחלתי שלך, היעדים שהגדרת ורמת המחויבות שלך ליישום ההמלצות. שינויים מסוימים, כמו ארגון תקציב או הסטת כספים לאפיקי השקעה טובים יותר, יכולים להראות תוצאות כבר בטווח של חודשים. בניית הון משמעותי או הגעה ליעדים גדולים כמו עצמאות פיננסית דורשים זמן ארוך יותר ומחויבות לתהליך.'
    },
    {
        id: 3,
        question: 'מה ההבדל בין הייעוץ שלכם לבין יועץ בבנק?',
        answer: 'בניגוד ליועצים בבנקים שלעתים קרובות מוגבלים למוצרים פיננסיים מסוימים או מונעים משיקולי רווח של הבנק, אנחנו מציעים ייעוץ אובייקטיבי ובלתי תלוי. הגישה שלנו רחבה יותר וכוללת את כל ההיבטים של החיים הפיננסיים שלך – מתקציב יומיומי ועד תכנון לטווח ארוך. אנחנו בונים תכנית המותאמת באופן מלא לצרכים, ליכולות ולשאיפות האישיות שלך.'
    },
    {
        id: 4,
        question: 'האם אתם מתאימים גם למשקיעים מתחילים?',
        answer: 'בהחלט! אנחנו מלווים אנשים בכל רמות הניסיון, כולל מתחילים לגמרי בעולם ההשקעות. למעשה, ליווי מקצועי בתחילת הדרך יכול למנוע טעויות יקרות ולקצר משמעותית את עקומת הלמידה. אנחנו מקפידים להסביר מושגים באופן פשוט וברור, לבנות בסיס ידע איתן, ולהתקדם בקצב המתאים לך.'
    },
    {
        id: 5,
        question: 'איך מתנהל תהליך הליווי?',
        answer: 'התהליך מתחיל בפגישת היכרות שבה אנחנו לומדים על המצב הנוכחי שלך, היעדים והאתגרים. לאחר מכן, אנחנו מבצעים ניתוח מקיף של המצב הפיננסי שלך ובונים תכנית פעולה מפורטת. בהמשך, אנחנו מלווים אותך ביישום התכנית, עם פגישות מעקב קבועות להערכת ההתקדמות והתאמות נדרשות. לאורך כל הדרך, אנחנו זמינים לשאלות, התייעצויות ותמיכה.'
    },
    {
        id: 6,
        question: 'האם אתם מציעים גם קורסים או סדנאות?',
        answer: 'כן, בנוסף לליווי האישי, אנחנו מציעים מגוון קורסים וסדנאות בנושאים פיננסיים. אלה מתאימים לאנשים שמעוניינים להעמיק את הידע בתחומים ספציפיים, כמו השקעות בשוק ההון, תכנון פרישה, או ניהול תקציב. הקורסים שלנו משלבים תיאוריה עם כלים פרקטיים שאפשר ליישם באופן מיידי.'
    }
];

export default function FinancialUpdatesSection() {
    const [openItem, setOpenItem] = useState<number | null>(null);

    const toggleItem = (id: number) => {
        setOpenItem(openItem === id ? null : id);
    };

    return (
        <section className="py-12 md:py-24">
            <div className="container mx-auto max-w-5xl px-4">
                <h2 className="text-5xl text-center mb-12 text-[#012E3E]">
                    רגע לפני שתשאלו, <span className="font-bold">הקדמנו אתכם עם תשובות</span>
                </h2>
                <div className="flex flex-col lg:flex-row gap-8 mt-12">
                    {/* Image on the right side (hidden on mobile) */}
                    <div className="hidden lg:block lg:w-1/2">
                        <img
                            src="https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png"
                            alt="גיא נתן - ייעוץ פיננסי"
                            className="max-w-full"
                        />
                    </div>

                    {/* FAQ accordion on the left */}
                    <div className="w-full lg:w-1/2">
                        <div className="space-y-4">
                            {faqItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="border-2 border-[#022E41] rounded-lg overflow-hidden"
                                >
                                    <button
                                        className="w-full p-4 text-right flex justify-between items-center bg-white hover:bg-gray-50 transition-colors"
                                        onClick={() => toggleItem(item.id)}
                                    >
                                        <span className="font-bold text-xl text-[#022E41]">{item.question}</span>
                                        {openItem === item.id ?
                                            <FaChevronUp className="text-[#022E41]" /> :
                                            <FaChevronDown className="text-[#022E41]" />
                                        }
                                    </button>

                                    <div 
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                            openItem === item.id ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                                        }`}
                                    >
                                        <div className="p-4 bg-gray-50 border-t-2 border-[#022E41]">
                                            <p className="text-lg text-right leading-relaxed">{item.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}   
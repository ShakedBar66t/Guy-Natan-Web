'use client';

import { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Loader from '@/components/Loader';

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  isPublished: boolean;
  order: number;
}

// FAQ Item component with accordion functionality
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4" dir="rtl">
      <div 
        className="cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="grid grid-cols-[1fr,auto] gap-4 items-center">
          <div className="text-right">
            <h3 className="text-xl md:text-2xl font-medium text-[#002F42]">{question}</h3>
          </div>
          <div className="text-[#32a191]">
            {isOpen ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
          </div>
        </div>
      </div>
      
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}
      >
        <div className="text-gray-600 text-right leading-relaxed pr-4"
             dangerouslySetInnerHTML={{ __html: answer }}
        />
      </div>
    </div>
  );
};

export default function QnAPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch FAQs from API
  useEffect(() => {
    async function fetchFaqs() {
      try {
        setLoading(true);
        const response = await fetch('/api/qna');
        if (!response.ok) {
          throw new Error('Failed to fetch FAQs');
        }
        const data = await response.json();
        setFaqs(data);
      } catch (err) {
        console.error('Error fetching FAQs:', err);
        setError('אירעה שגיאה בטעינת השאלות. נסה שוב מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    }

    fetchFaqs();
  }, []);

  // Fallback FAQs in case API fails or for development
  const fallbackFaqs = [
    {
      _id: '1',
      question: "איך יודעים מה המסלול שהכי מתאים לי?",
      answer: "עבדנו כבר עם מאות לקוחות ולמדנו שצריך לעשות איפון מלא כדי לייצר תכנית מותאמת אישית לכל אדם.",
      isPublished: true,
      order: 1
    },
    {
      _id: '2',
      question: "אני לא במצב פיננסי הכי טוב, התכנית רלוונטית לי?",
      answer: "הייחוד של התכניות שלנו הוא ההתאמה המוחלטת אליכם, כך שהתכנית והמטרות שלה הן נגזרות של המצב והמטרות האישיות שלכם.",
      isPublished: true,
      order: 2
    },
    {
      _id: '3',
      question: "אני משקיע/ה כבר תקופה, מרגיש/ה שאני מוכן לNext-step, איזו תכנית מתאימה לי?",
      answer: "אם אתם מגיעים עם ידע בסיסי בפיננסים, נמליץ לרוב על תכנית \"המשקיע האקטיבי\" בה הופכים ממשקיעים פסיביים למשקיעים אקטיביים שיודעים לנתח מגמות בשוק ההון. בכל מקרה אפשר להתחיל מפגישה חד פעמית להתאמת תוכנית מושלמת עבורך.",
      isPublished: true,
      order: 3
    },
    {
      _id: '4',
      question: "כסף תמיד מלחיץ אותי ואני חושש/ת שזה קצת גדול עליי.",
      answer: "השינוי במצב הפיננסי הוא לא קסם וסיימנו, אלא תהליך שקורה בצעדים קטנים, בקצב שמתאים לך ולא בקצב שלנו. אחרת זה לא יעבוד. בכל מקרה הצעד הראשון הוא להבין מה המצב המצוי ומה הרצוי ורק משם ממשיכים.",
      isPublished: true,
      order: 4
    }
  ];

  // Use fallback FAQs if API fails or in development
  const displayFaqs = faqs.length > 0 ? faqs : fallbackFaqs;

  const [newsletterData, setNewsletterData] = useState({
    name: '',
    phone: ''
  });

  const handleNewsletterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewsletterData({
      ...newsletterData,
      [e.target.name]: e.target.value
    });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('פרטיך נשלחו בהצלחה!');
    setNewsletterData({
      name: '',
      phone: ''
    });
  };

  return (
    <>
      {/* Header Banner */}
      <div className="bg-white py-6 mb-16">
        <MaxWidthWrapper>
          <h1 className="text-[#002F42] text-center text-5xl md:text-6xl font-bold mb-2">
            שאלות <span className="font-normal">תשובות</span>
          </h1>
        </MaxWidthWrapper>
      </div>

      <MaxWidthWrapper>
        {/* Intro Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#002F42] mb-6">
            השאלות שלכם <span className="text-[#32a191]">התשובות שלנו</span>
          </h2>
          <div className="max-w-2xl mx-auto">
            <p className="text-2xl font-bold text-[#002F42] mb-4">
              כסף הוא תחום שתמיד מעורר שאלות
            </p>
            <p className="text-xl text-gray-600 mb-6">
              אלו הן השאלות שבדרך כלל שואלים אותנו…
              <br />
              לא מצאתם את התשובה שלכם? אנחנו מאוד אוהבים להסביר ולענות,
            </p>
            <p className="text-2xl font-bold text-[#002F42]">
              שלחו לנו הודעה!
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-16 bg-white rounded-lg shadow-lg p-8">
          {loading ? (
            <Loader size="medium" text="טוען שאלות ותשובות..." />
          ) : error ? (
            <div className="text-center text-red-500 py-4">
              <p>{error}</p>
            </div>
          ) : (
            displayFaqs.map((faq) => (
              <FAQItem key={faq._id} question={faq.question} answer={faq.answer} />
            ))
          )}
        </div>

        {/* CTA Section */}
        <div className="bg-gray-100 rounded-lg p-8 text-center mb-16">
          <h3 className="text-2xl font-bold text-[#002F42] mb-4">
            נשארתם עם שאלה פתוחה?
          </h3>
          <p className="text-gray-600 mb-4">
            אנחנו מאוד אוהבים להסביר ולענות,
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-[#32a191] text-white font-medium py-3 px-6 rounded-lg hover:bg-[#002F42] transition-colors"
          >
            שלחו לנו הודעה
          </a>
        </div>
      </MaxWidthWrapper>
    </>
  );
} 
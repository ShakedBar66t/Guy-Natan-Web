"use client";

import Link from 'next/link';
import { FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';

// Blog posts data array
const blogPosts = [
  {
    id: 1,
    title: 'מדריך להשקעה בשוק ההון',
    timestamp: '05 במרץ, 2023',
    description: 'מדריך מקיף שיעזור לכם להבין את עקרונות ההשקעה בשוק ההון, כולל טיפים והמלצות למתחילים.',
    link: '/blog/stock-market-guide'
  },
  {
    id: 2,
    title: 'תקציב משפחתי חכם',
    timestamp: '15 באפריל, 2023',
    description: 'איך לבנות תקציב משפחתי יעיל שיעזור לכם לחסוך כסף, להקטין חובות ולבנות עתיד פיננסי בטוח.',
    link: '/blog/family-budget'
  },
  {
    id: 3,
    title: 'פנסיה וחיסכון לטווח ארוך',
    timestamp: '22 ביוני, 2023',
    description: 'הסבר מפורט על מסלולי פנסיה וחיסכון לטווח ארוך, השוואה בין האפשרויות וטיפים לבחירת המסלול המתאים לכם.',
    link: '/blog/pension-guide'
  },
];

export default function KnowledgeSection() {
    return (
        <section className="py-16">
            <div className="container mx-auto max-w-5xl px-4">
                <h2 className="text-5xl text-center mb-12 text-[#012E3E]">
                    ידע זה כוח <span className="font-bold">הנה כמה תכנים להתחיל מהם</span>
                </h2>
            </div>
            
            <div className="bg-[#022E41] w-full py-16">
                <div className="container mx-auto max-w-5xl px-4 flex flex-col items-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.map((post) => (
                            <div key={post.id} className="bg-white p-6 rounded-lg shadow-md flex flex-col h-[350px]">
                                <h3 className="text-2xl font-bold mb-2 text-[#022E41]">{post.title}</h3>
                                <div className="flex items-center text-gray-500 mb-4">
                                    <FaCalendarAlt className="mr-2" />
                                    <span className="text-sm pr-2">{post.timestamp}</span>
                                </div>
                                <p className="text-gray-600 mb-6 flex-grow overflow-y-auto">{post.description}</p>
                                <Link 
                                    href={post.link}
                                    className="mt-auto text-[#32a191] font-bold flex items-center group self-start"
                                >
                                    <span className="transition-transform duration-300 group-hover:-translate-x-1">קרא עוד</span>
                                    <FaArrowLeft className="mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
                                </Link>
                            </div>
                        ))}
                    </div>
                    <button className='mx-auto bg-white text-black px-6 py-4 mt-6 rounded-md'>
                        בואו ללמוד עוד
                    </button>
                </div>
            </div>
        </section>
    );
}   
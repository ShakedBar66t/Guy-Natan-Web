'use client';

import { useState } from 'react';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { FaSpotify, FaYoutube, FaApple } from 'react-icons/fa';
import Image from 'next/image';

export default function PodcastPage() {
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
      <div className="bg-white py-6 mb-8">
        <MaxWidthWrapper>
          <h1 className="text-[#002F42] text-center text-5xl md:text-6xl font-bold mb-2">
            פודקאסט <span className="font-normal">מפת החום</span>
          </h1>
        </MaxWidthWrapper>
      </div>

      {/* Podcast Hero Image - using regular img tag as fallback */}
      <div className="w-full flex justify-center mb-16">
        <div className="w-full max-w-5xl overflow-hidden rounded-lg shadow-lg">
          <img
            src="https://res.cloudinary.com/drld1bejg/image/upload/v1743281661/guy-podcast_image_acmmqy.jpg"
            alt="פודקאסט מפת החום עם גיא נתן"
            className="w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover"
          />
        </div>
      </div>

      <MaxWidthWrapper>
        {/* Main content */}
        <div className="text-center mb-16">
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto" dir="rtl">
            מבחינתי לכל אדם במדינת ישראל צריך ליפול אסימון בהסתכלות שלו על התחום הפיננסי בחייו. <strong>תתחילו מכאן:</strong>
          </p>

          {/* Podcast Platforms */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow flex flex-col items-center">
              <FaSpotify className="text-[#1DB954] text-6xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">האזינו בספוטיפיי</h3>
              <a 
                href="https://open.spotify.com/show/3wn134ScxD3LKncijgJhGc" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1DB954] text-white font-medium py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors mt-auto"
              >
                האזינו עכשיו
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow flex flex-col items-center">
              <FaYoutube className="text-[#FF0000] text-6xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">האזינו ביוטיוב</h3>
              <a 
                href="https://m.youtube.com/@guynatan9" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#FF0000] text-white font-medium py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors mt-auto"
              >
                האזינו עכשיו
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow flex flex-col items-center">
              <FaApple className="text-[#A2AAAD] text-6xl mb-4" />
              <h3 className="text-2xl font-bold mb-4">האזינו באפל</h3>
              <a 
                href="https://podcasts.apple.com/us/podcast/%D7%9E%D7%A4%D7%AA-%D7%94%D7%97%D7%95%D7%9D-%D7%92%D7%99%D7%90-%D7%A0%D7%AA%D7%9F/id1662095690" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#A2AAAD] text-white font-medium py-3 px-6 rounded-lg hover:bg-opacity-90 transition-colors mt-auto"
              >
                האזינו עכשיו
              </a>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#002F42] mb-6">
              תתחילו <span className="text-[#32a191]">לשמוע</span>
            </h2>
            <p className="text-xl max-w-3xl mx-auto">
              הפודקאסט "מפת החום" מביא לכם את המידע, הכלים והתובנות שיעזרו לכם לנווט בעולם הפיננסי המורכב. בכל פרק, גיא נתן מארח מומחים מובילים ומשתף טיפים פרקטיים להצלחה פיננסית.
            </p>
          </div>

          {/* Latest Episode Preview */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-16 text-right max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-[#002F42]">הפרק האחרון בפודקאסט</h3>
            <p className="text-lg mb-6" dir="rtl">
              בפרק האחרון בפודקאסט אירחתי את יניב פגוט, סמנכ"ל הבורסה לניירות ערך, לשיחה מרתקת על הזדמנויות, אתגרים והכיוון שאליו הולך השוק הישראלי. דיברנו על החיוניות של הבורסה לכלכלה הישראלית, על היתרונות של השוק המקומי, על החסמים שמעכבים אותו – ועל מה שצריך לקרות כדי שנראה יותר חברות ישראליות מצליחות דווקא כאן, ולא מעבר לים.
            </p>
            <div className="flex justify-center mt-8">
              <a 
                href="https://www.youtube.com/watch?v=WHssfeiNL3c" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full max-w-3xl mx-auto relative group"
              >
                <div className="overflow-hidden rounded-lg shadow-lg">
                  <img 
                    src="https://res.cloudinary.com/drld1bejg/image/upload/v1743282017/WHssfeiNL3c-HD_xhfann.jpg" 
                    alt="פרק פודקאסט עם יניב פגוט" 
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center">
                    <div className="bg-white bg-opacity-80 text-[#002F42] font-bold py-2 px-4 rounded-full flex items-center">
                      <FaYoutube className="text-[#FF0000] text-2xl mr-2" />
                      צפו בפרק המלא
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </>
  );
} 
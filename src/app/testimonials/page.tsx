'use client';

import { useState } from 'react';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { FaTimes, FaPlay } from 'react-icons/fa';

export default function TestimonialsPage() {
  // Video data array with video URLs, names, and quotes
  const testimonialVideos = [
    {
      id: 1,
      url: "https://player.vimeo.com/video/1054819980?h=b12d8161b3&badge=0&autopause=0&player_id=0&app_id=58479",
      name: "גיא, 29",
      quote: "״אנחנו מדברים כל הזמן והם עוזרים לי להבין דברים, שווה לבוא למישהו שילמד אותך מה לעשות״",
      caption: "אל תתבטל!!!"
    },
    {
      id: 2,
      url: "https://player.vimeo.com/video/1054900705?h=adcd8e8cc7&badge=0&autopause=0&player_id=0&app_id=58479",
      name: "נדב, 30",
      quote: "״אני אומר תודה על זה שאני בן 30, שהכרתי את גיא, ושהתחלתי ללמוד את עולם שוק ההון ולא בגיל 40״",
      caption: "צריך שאתה בוחר"
    },
    {
      id: 3,
      url: "https://player.vimeo.com/video/1054900878?h=0a59c9a7cf&badge=0&autopause=0&player_id=0&app_id=58479",
      name: "מקסים, 41",
      quote: "״אתה יכול להחליט להישאר בינוני או שאתה יכול להחליט לצמוח״",
      caption: "אני יודע שאוכל"
    },
    {
      id: 4,
      url: "https://player.vimeo.com/video/1054819539?h=929746af77&badge=0&autopause=0&player_id=0&app_id=58479",
      name: "ענבל, 21",
      quote: "״יש לך מישהו שאיתך 24/7, אני יכול לפנות אליהם כל הזמן, זה לא מובן מאליו״",
      caption: "הוא מפנה לך"
    },
    {
      id: 5,
      url: "https://player.vimeo.com/video/1054820428?h=0ff2b6e6e2&badge=0&autopause=0&player_id=0&app_id=58479",
      name: "אריאל, 27",
      quote: "״היום אני לא צריך לעבוד קשה בשביל להשיג כסף״",
      caption: "בשביל להשיג כסף"
    }
  ];

  // State for selected video in modal
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  return (
    <>
      <style jsx global>{`
        .video-container {
          border: 4px solid black;
          border-radius: 8px;
          overflow: hidden;
          display: block;
          position: relative;
        }
        
        .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: block;
          margin: 0;
          padding: 0;
          background: black;
          border: none;
        }
      `}</style>
      
      {/* Header Banner */}
      <div className="bg-[#002F42] py-6 mb-8">
        <MaxWidthWrapper>
          <h1 className="text-white text-center text-5xl md:text-6xl font-bold mb-2">
            לקוחות <span className="font-normal">מרוצים</span>
          </h1>
        </MaxWidthWrapper>
      </div>

      <MaxWidthWrapper>
        {/* Intro Text */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#002F42] mb-4">
            ככה זה נשמע <span className="text-[#32a191]">במילים שלכם</span>
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-700">
            כשאנחנו פוגשים אנשים מתמידים שבוחרים לקחת את העתיד הפיננסי בידיים שלהם בשילוב ההדרכה צמודה שלנו = <span className="font-bold">נוצרת הצלחה!</span>
          </p>
        </div>

        {/* Top row - 3 videos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8" dir="rtl">
          {testimonialVideos.slice(0, 3).map((video) => (
            <div key={video.id} className="testimonials-grid-item">
              <div 
                className="video-container shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedVideo(video.url)}
                style={{ aspectRatio: '9/16' }}
              >
                <iframe
                  src={video.url}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen={true}
                  title={video.name}
                ></iframe>
                
                {/* Text overlay positioned at the bottom */}
                <div className="absolute bottom-4 w-full text-center">
                  <div className="bg-black bg-opacity-50 inline-block px-4 py-2 text-white font-bold text-xl rounded">
                    {video.caption}
                  </div>
                </div>
              </div>
              
              {/* Name and quote below the video */}
              <div className="text-center mt-4 mb-8">
                <h3 className="text-2xl font-bold text-[#002F42]">{video.name}</h3>
                <p className="text-lg text-gray-700 mt-2">{video.quote}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Bottom row - 2 videos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16 max-w-4xl mx-auto" dir="rtl">
          {testimonialVideos.slice(3, 5).map((video) => (
            <div key={video.id} className="testimonials-grid-item">
              <div 
                className="video-container shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedVideo(video.url)}
                style={{ aspectRatio: '9/16' }}
              >
                <iframe
                  src={video.url}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen={true}
                  title={video.name}
                ></iframe>
                
                {/* Text overlay positioned at the bottom */}
                <div className="absolute bottom-4 w-full text-center">
                  <div className="bg-black bg-opacity-50 inline-block px-4 py-2 text-white font-bold text-xl rounded">
                    {video.caption}
                  </div>
                </div>
              </div>
              
              {/* Name and quote below the video */}
              <div className="text-center mt-4 mb-8">
                <h3 className="text-2xl font-bold text-[#002F42]">{video.name}</h3>
                <p className="text-lg text-gray-700 mt-2">{video.quote}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-gray-100 rounded-lg p-8 text-center mb-16">
          <h3 className="text-2xl font-bold text-[#002F42] mb-4">
            לקבלת פרטים נוספים עבור תוכנית ההכשרה
          </h3>
          <a 
            href="/contact" 
            className="inline-block bg-[#32a191] text-white font-medium py-3 px-8 rounded-lg hover:bg-[#002F42] transition-colors mt-4"
          >
            דברו איתנו עכשיו
          </a>
        </div>
      </MaxWidthWrapper>

      {/* Full-size Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50 testimonial-modal"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="relative w-full max-w-4xl video-container" 
            onClick={(e) => e.stopPropagation()}
            style={{ aspectRatio: '16/9' }}
          >
            <button 
              className="absolute -top-10 right-0 text-white text-3xl"
              onClick={() => setSelectedVideo(null)}
            >
              <FaTimes />
            </button>
            <iframe
              src={selectedVideo}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen={true}
              title="Testimonial Video"
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
} 
'use client';

import { useState, useRef, useEffect } from 'react';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import { FaTimes, FaPlay } from 'react-icons/fa';

interface TestimonialVideo {
  id: number;
  url: string;
  name: string;
  quote: string;
  caption: string;
  isPlaying?: boolean;
}

export default function TestimonialsPage() {
  // Video data array with video URLs, names, and quotes
  const [testimonialVideos, setTestimonialVideos] = useState<TestimonialVideo[]>([
    {
      id: 1,
      url: "https://player.vimeo.com/video/1054819980?h=b12d8161b3&badge=0&autopause=0&player_id=0&app_id=58479&background=1&controls=0&autoplay=0&muted=0",
      name: "גיא, 29",
      quote: "״אנחנו מדברים כל הזמן והם עוזרים לי להבין דברים, שווה לבוא למישהו שילמד אותך מה לעשות״",
      caption: "אל תתבטל!!!",
      isPlaying: false
    },
    {
      id: 2,
      url: "https://player.vimeo.com/video/1054900705?h=adcd8e8cc7&badge=0&autopause=0&player_id=0&app_id=58479&background=1&controls=0&autoplay=0&muted=0",
      name: "נדב, 30",
      quote: "״אני אומר תודה על זה שאני בן 30, שהכרתי את גיא, ושהתחלתי ללמוד את עולם שוק ההון ולא בגיל 40״",
      caption: "צריך שאתה בוחר",
      isPlaying: false
    },
    {
      id: 3,
      url: "https://player.vimeo.com/video/1054900878?h=0a59c9a7cf&badge=0&autopause=0&player_id=0&app_id=58479&background=1&controls=0&autoplay=0&muted=0",
      name: "מקסים, 41",
      quote: "״אתה יכול להחליט להישאר בינוני או שאתה יכול להחליט לצמוח״",
      caption: "אני יודע שאוכל",
      isPlaying: false
    },
    {
      id: 4,
      url: "https://player.vimeo.com/video/1054819539?h=929746af77&badge=0&autopause=0&player_id=0&app_id=58479&background=1&controls=0&autoplay=0&muted=0",
      name: "ענבל, 21",
      quote: "״יש לך מישהו שאיתך 24/7, אני יכול לפנות אליהם כל הזמן, זה לא מובן מאליו״",
      caption: "הוא מפנה לך",
      isPlaying: false
    },
    {
      id: 5,
      url: "https://player.vimeo.com/video/1054820428?h=0ff2b6e6e2&badge=0&autopause=0&player_id=0&app_id=58479&background=1&controls=0&autoplay=0&muted=0",
      name: "אריאל, 27",
      quote: "״היום אני לא צריך לעבוד קשה בשביל להשיג כסף״",
      caption: "בשביל להשיג כסף",
      isPlaying: false
    }
  ]);

  // iframeRefs for all videos
  const iframeRefs = useRef<(HTMLIFrameElement | null)[]>([]);

  // State for selected video in modal
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<number | null>(null);
  const modalIframeRef = useRef<HTMLIFrameElement | null>(null);

  // Initialize refs array when videos change
  useEffect(() => {
    iframeRefs.current = iframeRefs.current.slice(0, testimonialVideos.length);
  }, [testimonialVideos]);

  // Function to toggle play/pause
  const togglePlayPause = (index: number, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation();
    }
    
    const iframe = iframeRefs.current[index];
    if (!iframe) return;

    const isCurrentlyPlaying = testimonialVideos[index].isPlaying;
    
    if (isCurrentlyPlaying) {
      // Pause video
      iframe.contentWindow?.postMessage(
        JSON.stringify({
          method: "pause",
          value: ""
        }),
        "https://player.vimeo.com"
      );
    } else {
      // Play video
      iframe.contentWindow?.postMessage(
        JSON.stringify({
          method: "play",
          value: ""
        }),
        "https://player.vimeo.com"
      );
    }

    // Update the playing state
    setTestimonialVideos(prevVideos => 
      prevVideos.map((video, i) => 
        i === index 
          ? { ...video, isPlaying: !video.isPlaying } 
          : video
      )
    );
  };

  // Toggle play/pause for the modal video
  const toggleModalPlayPause = () => {
    if (selectedVideoIndex === null || !modalIframeRef.current) return;
    
    const isPlaying = testimonialVideos[selectedVideoIndex].isPlaying;
    
    if (isPlaying) {
      // Pause video
      modalIframeRef.current.contentWindow?.postMessage(
        JSON.stringify({
          method: "pause",
          value: ""
        }),
        "https://player.vimeo.com"
      );
    } else {
      // Play video
      modalIframeRef.current.contentWindow?.postMessage(
        JSON.stringify({
          method: "play",
          value: ""
        }),
        "https://player.vimeo.com"
      );
    }

    // Update the playing state
    setTestimonialVideos(prevVideos => 
      prevVideos.map((video, i) => 
        i === selectedVideoIndex 
          ? { ...video, isPlaying: !video.isPlaying } 
          : video
      )
    );
  };

  // Open the modal with a specific video
  const openVideoModal = (index: number) => {
    setSelectedVideo(testimonialVideos[index].url);
    setSelectedVideoIndex(index);
  };

  // Close the modal
  const closeModal = () => {
    // Pause the video when closing the modal
    if (selectedVideoIndex !== null && modalIframeRef.current) {
      modalIframeRef.current.contentWindow?.postMessage(
        JSON.stringify({
          method: "pause",
          value: ""
        }),
        "https://player.vimeo.com"
      );
      
      // Update the playing state
      setTestimonialVideos(prevVideos => 
        prevVideos.map((video, i) => 
          i === selectedVideoIndex 
            ? { ...video, isPlaying: false } 
            : video
        )
      );
    }
    
    setSelectedVideo(null);
    setSelectedVideoIndex(null);
  };

  // Set up Vimeo message listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://player.vimeo.com") return;
      
      try {
        const data = JSON.parse(event.data);
        
        // No longer auto-play videos on ready
        
        // Handle player events
        if (data.event === "play" || data.event === "pause") {
          // Find which video sent the event
          const iframe = event.source as Window;
          
          // Check if it's the modal video
          if (modalIframeRef.current?.contentWindow === iframe && selectedVideoIndex !== null) {
            setTestimonialVideos(prevVideos => 
              prevVideos.map((video, i) => 
                i === selectedVideoIndex 
                  ? { ...video, isPlaying: data.event === "play" } 
                  : video
              )
            );
            return;
          }
          
          // Or one of the grid videos
          const index = iframeRefs.current.findIndex(ref => ref?.contentWindow === iframe);
          if (index !== -1) {
            setTestimonialVideos(prevVideos => 
              prevVideos.map((video, i) => 
                i === index 
                  ? { ...video, isPlaying: data.event === "play" } 
                  : video
              )
            );
          }
        }
      } catch (e) {
        // Ignore parsing errors
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [selectedVideoIndex]);

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
          {testimonialVideos.slice(0, 3).map((video, index) => (
            <div key={video.id} className="testimonials-grid-item">
              <div 
                className="video-container shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => openVideoModal(index)}
                style={{ aspectRatio: '9/16' }}
              >
                <iframe
                  ref={el => {
                    iframeRefs.current[index] = el;
                  }}
                  src={video.url}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen={false}
                  title={video.name}
                ></iframe>
                
                {/* Play/Pause overlay */}
                <div 
                  onClick={(e) => togglePlayPause(index, e)} 
                  className="absolute top-0 left-0 w-full h-full z-10"
                >
                  {!video.isPlaying && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="white" opacity="0.8">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  )}
                </div>
                
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
          {testimonialVideos.slice(3, 5).map((video, index) => (
            <div key={video.id} className="testimonials-grid-item">
              <div 
                className="video-container shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => openVideoModal(index + 3)}
                style={{ aspectRatio: '9/16' }}
              >
                <iframe
                  ref={el => {
                    iframeRefs.current[index + 3] = el;
                  }}
                  src={video.url}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen={false}
                  title={video.name}
                ></iframe>
                
                {/* Play/Pause overlay */}
                <div 
                  onClick={(e) => togglePlayPause(index + 3, e)} 
                  className="absolute top-0 left-0 w-full h-full z-10"
                >
                  {!video.isPlaying && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="white" opacity="0.8">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  )}
                </div>
                
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
      {selectedVideo && selectedVideoIndex !== null && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50 testimonial-modal"
          onClick={closeModal}
        >
          <div 
            className="relative w-full max-w-4xl video-container" 
            onClick={(e) => e.stopPropagation()}
            style={{ aspectRatio: '16/9' }}
          >
            <button 
              className="absolute -top-10 right-0 text-white text-3xl"
              onClick={closeModal}
            >
              <FaTimes />
            </button>
            <iframe
              ref={modalIframeRef}
              src={`${selectedVideo}`}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen={false}
              title="Testimonial Video"
            ></iframe>
            
            {/* Modal play/pause overlay */}
            <div 
              onClick={toggleModalPlayPause} 
              className="absolute top-0 left-0 w-full h-full cursor-pointer z-10"
            >
              {!testimonialVideos[selectedVideoIndex]?.isPlaying && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="white" opacity="0.8">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
} 
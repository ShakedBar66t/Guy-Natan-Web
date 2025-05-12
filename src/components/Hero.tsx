"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function Hero() {
  const videoRef = useRef<HTMLIFrameElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Function to scroll to the programs section
  const scrollToPrograms = () => {
    const programsSection = document.getElementById('programs');
    if (programsSection) {
      programsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Function to toggle play/pause
  const togglePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      // Pause video
      videoRef.current.contentWindow?.postMessage(
        JSON.stringify({
          method: "pause",
          value: ""
        }),
        "https://player.vimeo.com"
      );
      setIsPlaying(false);
    } else {
      // Play video
      videoRef.current.contentWindow?.postMessage(
        JSON.stringify({
          method: "play",
          value: ""
        }),
        "https://player.vimeo.com"
      );
      setIsPlaying(true);
    }
  };

  // Setup the video player when component mounts
  useEffect(() => {
    // Create a message listener to handle Vimeo API events
    const handleMessage = (event: MessageEvent) => {
      // Only handle messages from Vimeo
      if (event.origin !== "https://player.vimeo.com") return;
      
      try {
        const data = JSON.parse(event.data);
        // If the player is ready, play the video
        if (data.event === "ready" && videoRef.current) {
          // Send play command to the iframe
          videoRef.current.contentWindow?.postMessage(
            JSON.stringify({
              method: "play",
              value: ""
            }),
            "https://player.vimeo.com"
          );
          setIsPlaying(true);
        }
        
        // Update playing state based on player events
        if (data.event === "play") {
          setIsPlaying(true);
        } else if (data.event === "pause") {
          setIsPlaying(false);
        }
      } catch (e) {
        // Ignore parsing errors
      }
    };

    // Add event listener
    window.addEventListener("message", handleMessage);
    
    // Cleanup
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return (
    <section className="py-6 lg:py-20 bg-[#022E41]">
      <div className="container mx-auto px-4">
        <h2 className="text-[32px] md:text-5xl font-normal text-center text-white ">
          גן עדן פיננסי
        </h2>
        <p className="mt-4 text-center text-[18px] md:text-[26px] text-white">
          הבית שלך לחדשות ועדכונים חמים מהעולם הפיננסי ושוק ההון.
          <br />
          כל מה שצריך לדעת כדי לקבל{" "}
          <span className="font-bold"> החלטות חכמות</span>.
        </p>
        
        {/* Video first on mobile */}
        <div className="flex flex-col md:flex-col-reverse">
          {/* Video */}
          <div className="w-full max-w-4xl mx-auto overflow-hidden rounded-lg shadow-xl mt-6 mb-6 md:mb-0 md:mt-0">
            <div className="relative pt-[56.25%]">
              <iframe
                ref={videoRef}
                src="https://player.vimeo.com/video/1060951547?h=42a836d1a9&api=1&background=1&autopause=0&loop=1&muted=0&title=0&byline=0&portrait=0&controls=0"
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen={false}
                title="גיא נתן סרטון"
              ></iframe>
              {/* Clickable overlay to handle play/pause */}
              <div 
                ref={overlayRef}
                onClick={togglePlayPause} 
                className="absolute top-0 left-0 w-full h-full cursor-pointer z-10"
              >
                {!isPlaying && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="white" opacity="0.8">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Buttons - below video on mobile, above on desktop */}
          <div className="flex flex-col md:flex-row justify-center my-6 md:my-10 gap-4 md:gap-10">
            <Link href="/blog" className="md:w-[180px] w-full">
              <button className="w-full bg-[#022E41] border border-white rounded-md text-white p-2 md:p-3 text-base md:text-lg hover:bg-white hover:text-[#022E41]">
                בואו נתחיל ללמוד
              </button>
            </Link>
            <button 
              onClick={scrollToPrograms}
              className="w-full md:w-[180px] bg-white text-[#022E41] p-2 md:p-3 border border-[#022E41] rounded-md text-base md:text-lg hover:bg-[#022E41] hover:text-white hover:border-white"
            >
              המסלולים שלנו
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

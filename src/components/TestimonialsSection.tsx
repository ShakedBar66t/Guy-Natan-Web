'use client';

import { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface TestimonialVideo {
    id: number;
    url: string;
    isPlaying?: boolean;
}

export default function TestimonialsSection() {
    // Video data array with video URLs
    const [testimonialVideos, setTestimonialVideos] = useState<TestimonialVideo[]>([
        {
            id: 1,
            url: "https://player.vimeo.com/video/1054819980?h=b12d8161b3&badge=0&autopause=0&player_id=0&app_id=58479&background=1&controls=0&autoplay=0&muted=0",
            isPlaying: false
        },
        {
            id: 2,
            url: "https://player.vimeo.com/video/1054900705?h=adcd8e8cc7&badge=0&autopause=0&player_id=0&app_id=58479&background=1&controls=0&autoplay=0&muted=0",
            isPlaying: false
        },
        {
            id: 3,
            url: "https://player.vimeo.com/video/1054900878?h=0a59c9a7cf&badge=0&autopause=0&player_id=0&app_id=58479&background=1&controls=0&autoplay=0&muted=0",
            isPlaying: false
        },
        {
            id: 4,
            url: "https://player.vimeo.com/video/1054819539?h=929746af77&badge=0&autopause=0&player_id=0&app_id=58479&background=1&controls=0&autoplay=0&muted=0",
            isPlaying: false
        },
        {
            id: 5,
            url: "https://player.vimeo.com/video/1054820428?h=0ff2b6e6e2&badge=0&autopause=0&player_id=0&app_id=58479&background=1&controls=0&autoplay=0&muted=0",
            isPlaying: false
        }
    ]);
    
    // iframeRefs for each video
    const iframeRefs = useRef<(HTMLIFrameElement | null)[]>([]);

    // Handle window resize and determine slidesPerView based on screen width
    const [slidesPerView, setSlidesPerView] = useState(4);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setSlidesPerView(1);
            } else if (window.innerWidth < 1024) {
                setSlidesPerView(2);
            } else if (window.innerWidth < 1280) {
                setSlidesPerView(3);
            } else {
                setSlidesPerView(4);
            }
        };

        // Set initial value
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle video play/pause
    const togglePlayPause = (index: number) => {
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
            // Ensure sound is on
            iframe.contentWindow?.postMessage(
                JSON.stringify({
                    method: "setVolume",
                    value: 1
                }),
                "https://player.vimeo.com"
            );

            // Then play video
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

    // Initialize refs array when videos change
    useEffect(() => {
        iframeRefs.current = iframeRefs.current.slice(0, testimonialVideos.length);
    }, [testimonialVideos]);

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
    }, []);

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <h2 className="text-4xl md:text-5xl text-[#012E3E] text-center mb-12">
                    אנשים מחויבים <span className="font-bold">ביצועים חזקים</span>
                </h2>
                
                <div className="mx-auto max-w-7xl">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={20}
                        slidesPerView={slidesPerView}
                        navigation
                        pagination={{ clickable: true }}
                        className="testimonials-swiper"
                    >
                        {testimonialVideos.map((video, index) => (
                            <SwiperSlide key={video.id}>
                                <div className="p-2">
                                    <div 
                                        className="border-black rounded-lg shadow-md overflow-hidden" 
                                        style={{ borderWidth: '3px', borderStyle: 'solid' }}
                                    >
                                        <div className="relative aspect-[9/16]">
                                            <iframe
                                                ref={el => {
                                                  iframeRefs.current[index] = el;
                                                }}
                                                src={video.url}
                                                className="absolute top-0 left-0 w-full h-full"
                                                frameBorder="0"
                                                allow="autoplay; fullscreen; picture-in-picture"
                                                allowFullScreen={false}
                                                title={`Testimonial ${video.id}`}
                                            ></iframe>
                                            {/* Clickable overlay to handle play/pause */}
                                            <div 
                                                onClick={() => togglePlayPause(index)} 
                                                className="absolute top-0 left-0 w-full h-full cursor-pointer z-10"
                                            >
                                                {!video.isPlaying && (
                                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="white" opacity="0.8">
                                                            <path d="M8 5v14l11-7z"/>
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="flex justify-center mt-12">
                    <button className="bg-[#022E41] text-white px-8 py-4 rounded-md text-xl hover:bg-[#032636] transition-colors">
                        בואו לראות עוד
                    </button>
                </div>
            </div>
        </section>
    );
}      
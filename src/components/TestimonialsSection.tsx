'use client';

import { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function TestimonialsSection() {
    // Video data array with video URLs
    const testimonialVideos = [
        {
            id: 1,
            url: "https://player.vimeo.com/video/1054819980?h=b12d8161b3&badge=0&autopause=0&player_id=0&app_id=58479"
        },
        {
            id: 2,
            url: "https://player.vimeo.com/video/1054900705?h=adcd8e8cc7&badge=0&autopause=0&player_id=0&app_id=58479"
        },
        {
            id: 3,
            url: "https://player.vimeo.com/video/1054900878?h=0a59c9a7cf&badge=0&autopause=0&player_id=0&app_id=58479"
        },
        {
            id: 4,
            url: "https://player.vimeo.com/video/1054819539?h=929746af77&badge=0&autopause=0&player_id=0&app_id=58479"
        },
        {
            id: 5,
            url: "https://player.vimeo.com/video/1054820428?h=0ff2b6e6e2&badge=0&autopause=0&player_id=0&app_id=58479"
        }
    ];

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
                        {testimonialVideos.map((video) => (
                            <SwiperSlide key={video.id}>
                                <div className="p-2">
                                    <div 
                                        className="border-black rounded-lg shadow-md overflow-hidden" 
                                        style={{ borderWidth: '3px', borderStyle: 'solid' }}
                                    >
                                        <div className="relative aspect-[9/16]">
                                            <iframe
                                                src={video.url}
                                                className="absolute top-0 left-0 w-full h-full"
                                                frameBorder="0"
                                                allow="autoplay; fullscreen; picture-in-picture"
                                                title={`Testimonial ${video.id}`}
                                            ></iframe>
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
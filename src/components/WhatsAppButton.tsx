"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLabelVisible, setIsLabelVisible] = useState(false);
  
  useEffect(() => {
    // Show button after scrolling down 300px
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    
    window.addEventListener('scroll', toggleVisibility);
    
    // Set visible on initial load (optional)
    setIsVisible(true);
    
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);
  
  return (
    <div 
      className={`fixed bottom-4 left-4 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      onMouseEnter={() => setIsLabelVisible(true)}
      onMouseLeave={() => setIsLabelVisible(false)}
    >
      {/* Label that appears on hover */}
      <div 
        className={`absolute bottom-16 left-0 bg-white text-[#022E41] font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-300 ${
          isLabelVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2 pointer-events-none'
        }`}
      >
        <div className="relative">
          צור קשר בוואטסאפ
          {/* Arrow pointing down */}
          <div className="absolute -bottom-6 left-5 w-4 h-4 bg-white transform rotate-45"></div>
        </div>
      </div>
      
      <a 
        href="https://wa.link/w7fl2n" 
        target="_blank" 
        rel="noopener noreferrer"
        className="block bg-white p-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-transform duration-300"
        aria-label="צור קשר בוואטסאפ"
        title="צור קשר בוואטסאפ"
      >
        <div className="relative w-14 h-14">
          <svg viewBox="0 0 32 32" className="w-full h-full drop-shadow-md">
            <path 
              d=" M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-.143-.73-.143l-2.036-.01c-.32-.033-.603.26-.832.621-.496.798-1.129 2.059-1.129 3.713 0 2.31 1.18 4.038 1.693 4.546.33.329 5.017 7.684 12.145 10.777 1.426.613 2.533.888 3.394 1.109.714.174 1.363.174 1.88.116.574-.058 1.788-.73 2.037-1.447.249-.716.249-1.318.175-1.447-.075-.129-.27-.2-.574-.345-.802-.401-2.909-1.434-3.365-1.594-.287-.1-.574-.086-.802.058-.274.195-.946.834-1.159 1.02-.215.188-.43.232-.715.072-.401-.187-1.578-.616-3.008-1.967-1.11-.955-1.862-2.137-2.076-2.493-.215-.357-.022-.549.161-.726.16-.16.36-.416.516-.615.144-.187.229-.357.301-.575.06-.186.013-.358-.045-.472-.058-.129-.59-1.425-.806-1.952z" 
              fill="#4CAF50" 
            />
            <path 
              d="M16.465 3c-3.836 0-7.452 1.502-10.173 4.227C3.575 9.95 2.075 13.573 2.075 17.416c0 1.344.196 2.69.588 3.996l-1.228 4.523a.995.995 0 0 0 .276 1.028.99.99 0 0 0 1.024.268l4.553-1.214a14.23 14.23 0 0 0 3.958.58c8.076 0 14.648-6.574 14.648-14.655 0-3.915-1.518-7.594-4.269-10.35-2.753-2.758-6.42-4.276-10.327-4.276l-.033-.088zm.033 2.09c3.276 0 6.353 1.29 8.69 3.633 2.338 2.343 3.628 5.434 3.628 8.713 0 6.787-5.523 12.312-12.32 12.312-1.243 0-2.468-.176-3.645-.523-.311-.093-.631-.055-.913.105l-2.664.7.698-2.606c.163-.31.206-.667.117-1.014a12.12 12.12 0 0 1-.543-3.662c0-6.784 5.516-12.308 12.306-12.308h.014v-.75z" 
              fill="#4CAF50" 
            />
          </svg>
          
          {/* Pulsing effect */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
          </span>
        </div>
      </a>
    </div>
  );
} 
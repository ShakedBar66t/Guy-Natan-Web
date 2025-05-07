'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function HostagesTicker() {
  useEffect(() => {
    // Create the div element if it doesn't exist
    let div = document.getElementById('bthn');
    if (!div) {
      div = document.createElement('div');
      div.id = 'bthn';
      div.lang = 'he';
      document.body.appendChild(div);
    }
    // Apply custom styles for size and position
    div.style.position = 'fixed';
    div.style.right = '32px';
    div.style.bottom = '32px';
    div.style.zIndex = '50';
    
    // Responsive scaling based on screen width
    if (window.innerWidth < 600) {
      div.style.transform = 'scale(0.7)';
    } else {
      div.style.transform = 'scale(1.15)';
    }
    div.style.transformOrigin = 'bottom right';
    
    // Add resize event listener to adjust scale when screen size changes
    const handleResize = () => {
      if (window.innerWidth < 600) {
        div.style.transform = 'scale(0.7)';
      } else {
        div.style.transform = 'scale(1.15)';
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <Script
        src="https://bringthemhomenow.net/1.3.0/hostages-ticker.js"
        integrity="sha384-MmP7bD5QEJWvJccg9c0lDnn3LjjqQWDiRCxRV+NU8hij15icuwb29Jfw1TqJwuSv"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
    </>
  );
} 
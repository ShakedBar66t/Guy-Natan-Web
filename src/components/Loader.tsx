'use client';

import React from 'react';

interface LoaderProps {
  fullScreen?: boolean;
  size?: 'small' | 'medium' | 'large';
  text?: string | null;
  className?: string;
}

export default function Loader({ 
  fullScreen = false, 
  size = 'medium', 
  text = 'טוען נתונים...', 
  className = '' 
}: LoaderProps) {
  // Set size based on the prop
  const sizeClass = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  }[size];

  // Create the loader content
  const loaderContent = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`${sizeClass} relative`}>
        <img
          src="https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png"
          alt="Loading..."
          className="w-full h-full object-contain animate-spin-slow"
          style={{ animationDuration: '3s' }}
        />
      </div>
      {text && (
        <p className="mt-4 text-[#002F42] font-medium animate-pulse">{text}</p>
      )}
    </div>
  );

  // Return full screen loader or inline loader
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-80 z-50 flex items-center justify-center">
        {loaderContent}
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center my-6">
      {loaderContent}
    </div>
  );
} 
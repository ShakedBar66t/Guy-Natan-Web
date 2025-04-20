'use client';

import React from 'react';

interface LoaderProps {
  fullScreen?: boolean;
  size?: 'small' | 'medium' | 'large';
  text?: string | null;
  className?: string;
  type?: 'logo' | 'spinner';
}

export default function Loader({ 
  fullScreen = false, 
  size = 'medium', 
  text = 'טוען נתונים...', 
  className = '',
  type = 'logo'
}: LoaderProps) {
  // Set size based on the prop
  const sizeClass = {
    small: type === 'logo' ? 'w-16 h-16' : 'w-5 h-5',
    medium: 'w-24 h-24',
    large: 'w-32 h-32',
  }[size];

  // Spinner component for buttons and small contexts
  const spinner = (
    <div className={`${sizeClass} relative inline-block`}>
      <div className="w-full h-full border-4 border-gray-200 border-t-[#32a191] rounded-full animate-spin"></div>
    </div>
  );
  
  // Logo component for larger contexts
  const logo = (
    <div className={`${sizeClass} relative`}>
      <img
        src="https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png"
        alt="Loading..."
        className="w-full h-full object-contain animate-spin-slow"
        style={{ animationDuration: '3s' }}
      />
    </div>
  );

  // Create the loader content based on type
  const loaderContent = (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      {type === 'spinner' ? spinner : logo}
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
    <div className={`w-full flex justify-center ${size === 'small' && type === 'spinner' ? 'my-0' : 'my-6'}`}>
      {loaderContent}
    </div>
  );
} 
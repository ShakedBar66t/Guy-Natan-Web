"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface LogoLoaderProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

export default function LogoLoader({ size = "large", className = "" }: LogoLoaderProps) {
  const [animation, setAnimation] = useState(0);
  
  const sizeMap = {
    small: { width: 60, height: 60 },
    medium: { width: 90, height: 90 },
    large: { width: 120, height: 120 },
  };
  
  const { width, height } = sizeMap[size];
  
  useEffect(() => {
    // Create a sequence of animation states
    const interval = setInterval(() => {
      setAnimation((prev) => (prev + 1) % 4);
    }, 600);
    
    return () => clearInterval(interval);
  }, []);
  
  // Different animation states for a more polished look
  const animationClasses = [
    "scale-100 opacity-100 rotate-0", 
    "scale-105 opacity-95 rotate-1", 
    "scale-100 opacity-100 rotate-0",
    "scale-95 opacity-90 rotate-[-1deg]"
  ][animation];
  
  // Enhanced shadow effect that creates a nice floating appearance
  const shadowClass = [
    "drop-shadow-lg", 
    "drop-shadow-xl", 
    "drop-shadow-2xl",
    "drop-shadow-xl"
  ][animation];
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div 
        className={`transition-all duration-500 ease-in-out ${animationClasses} ${shadowClass}`}
        style={{ 
          transformOrigin: 'center',
          animation: 'float 3s ease-in-out infinite',
        }}
      >
        <Image
          src="https://res.cloudinary.com/drld1bejg/image/upload/v1743255601/GuyNatanLogo-removebg-preview_atdnde.png"
          alt="Guy Natan Logo"
          width={width}
          height={height}
          priority
          className="object-contain"
        />
      </div>
      
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
} 
'use client';

import { useEffect, useState } from 'react';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import LogoLoader from '@/components/LogoLoader';

export default function LoaderShowcasePage() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Auto-refresh loader every 15 seconds to simulate loading states
    const timer = setInterval(() => {
      setIsLoading(false);
      
      setTimeout(() => {
        setIsLoading(true);
      }, 1000);
    }, 15000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <MaxWidthWrapper className="py-16">
      <h1 className="text-3xl font-bold text-center mb-12">הדגמת אנימציות טעינה</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-xl font-bold mb-8 text-center">גודל קטן</h2>
          <div className="h-32 flex items-center justify-center">
            <LogoLoader size="small" />
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-xl font-bold mb-8 text-center">גודל בינוני</h2>
          <div className="h-32 flex items-center justify-center">
            <LogoLoader size="medium" />
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-xl font-bold mb-8 text-center">גודל גדול</h2>
          <div className="h-32 flex items-center justify-center">
            <LogoLoader size="large" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        <div className="bg-[#022E41] p-8 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-xl font-bold mb-8 text-center text-white">לבן על רקע כהה</h2>
          <div className="h-32 flex items-center justify-center">
            <LogoLoader size="large" color="white" />
          </div>
        </div>
        
        <div className="bg-[#32a191] p-8 rounded-lg shadow-md flex flex-col items-center">
          <h2 className="text-xl font-bold mb-8 text-center text-white">על רקע צבעוני</h2>
          <div className="h-32 flex items-center justify-center">
            <LogoLoader size="large" color="white" />
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 p-8 rounded-lg shadow-md flex flex-col items-center mb-16">
        <h2 className="text-xl font-bold mb-8 text-center">סימולציית טעינה</h2>
        <div className="h-64 flex flex-col items-center justify-center w-full">
          {isLoading ? (
            <LogoLoader size="large" />
          ) : (
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 mb-4">הטעינה הושלמה!</p>
              <p className="text-gray-600">טוען מחדש בעוד מספר שניות...</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-center">
        <a href="/" className="bg-[#022E41] text-white px-6 py-3 rounded-md hover:bg-[#32a191] transition-colors">
          חזרה לעמוד הבית
        </a>
      </div>
    </MaxWidthWrapper>
  );
} 
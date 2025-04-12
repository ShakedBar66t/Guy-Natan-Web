'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import Loader from '@/components/Loader';
import { useParams } from 'next/navigation';

interface FinancialTerm {
  _id: string;
  term: string;
  definition: string;
  slug: string;
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function TermPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const [term, setTerm] = useState<FinancialTerm | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchTerm() {
      try {
        setLoading(true);
        // Fetch all terms (since we don't have an API endpoint for single term yet)
        const response = await fetch('/api/glossary');
        if (!response.ok) {
          throw new Error('Failed to fetch financial terms');
        }
        
        const data = await response.json();
        
        // Find the term with matching slug
        const matchingTerm = data.find((t: FinancialTerm) => t.slug === slug);
        
        if (matchingTerm) {
          setTerm(matchingTerm);
        } else {
          setError('המונח המבוקש לא נמצא');
        }
      } catch (err) {
        console.error('Error fetching term:', err);
        setError('אירעה שגיאה בטעינת המונח. נסה שוב מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      fetchTerm();
    }
  }, [slug]);

  return (
    <>
      {/* Header Banner */}
      <div className="bg-[#002F42] py-6 mb-8">
        <MaxWidthWrapper>
          <h1 className="text-white text-center text-4xl md:text-5xl font-bold mb-2">
            מילון <span className="font-normal">מושגים</span>
          </h1>
        </MaxWidthWrapper>
      </div>

      <MaxWidthWrapper>
        <div className="mb-6">
          <Link 
            href="/blog?tab=glossary" 
            className="text-[#32a191] hover:text-[#002F42] transition-colors flex items-center gap-2"
            dir="rtl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            <span>חזרה למילון המושגים</span>
          </Link>
        </div>
        
        {loading ? (
          <Loader />
        ) : error ? (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center mb-16">
            {error}
          </div>
        ) : term ? (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-16" dir="rtl">
            <h2 className="text-3xl font-bold text-[#002F42] mb-6 border-b border-gray-200 pb-4">
              {term.term}
            </h2>
            
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: term.definition }} />
            </div>
            
            <div className="mt-12 pt-6 border-t border-gray-200">
              <h3 className="text-xl font-semibold text-[#002F42] mb-4">מושגים נוספים שיכולים לעניין אותך</h3>
              
              <Link 
                href="/blog?tab=glossary" 
                className="bg-[#32a191] text-white px-4 py-2 rounded-md inline-block hover:bg-[#002F42] transition-colors"
              >
                לכל המושגים במילון
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 mb-16">
            <div className="text-xl text-gray-600">המונח לא נמצא</div>
          </div>
        )}
      </MaxWidthWrapper>
    </>
  );
} 
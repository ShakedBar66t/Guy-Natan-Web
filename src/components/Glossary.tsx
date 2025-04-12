'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Loader from './Loader';

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

export default function Glossary() {
  const [terms, setTerms] = useState<FinancialTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchTerms() {
      try {
        setLoading(true);
        const response = await fetch('/api/glossary');
        if (!response.ok) {
          throw new Error('Failed to fetch financial terms');
        }
        const data = await response.json();
        setTerms(data);
      } catch (err) {
        console.error('Error fetching financial terms:', err);
        setError('אירעה שגיאה בטעינת המונחים. נסה שוב מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    }

    fetchTerms();
  }, []);

  // Group terms alphabetically
  const groupedTerms: { [key: string]: FinancialTerm[] } = {};
  
  terms.forEach(term => {
    // Get the first letter of the term
    const firstLetter = term.term.charAt(0);
    
    if (!groupedTerms[firstLetter]) {
      groupedTerms[firstLetter] = [];
    }
    
    groupedTerms[firstLetter].push(term);
  });
  
  // Sort letters
  const sortedLetters = Object.keys(groupedTerms).sort();

  // Toggle term expansion
  const toggleTerm = (id: string) => {
    if (expandedTerm === id) {
      setExpandedTerm(null);
    } else {
      setExpandedTerm(id);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-4 rounded-lg text-center">
        {error}
      </div>
    );
  }

  if (terms.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-16" dir="rtl">
      <h2 className="text-2xl font-bold text-[#002F42] mb-6 text-center">
        מילון מונחי <span className="text-[#32a191]">פיננסים</span>
      </h2>
      
      {/* Letter index */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {sortedLetters.map(letter => (
          <a 
            key={letter}
            href={`#letter-${letter}`}
            className="inline-block w-8 h-8 bg-[#f5f5f5] rounded-full flex items-center justify-center text-[#002F42] font-bold hover:bg-[#32a191] hover:text-white transition-colors"
          >
            {letter}
          </a>
        ))}
      </div>
      
      {/* Terms list */}
      <div className="space-y-8">
        {sortedLetters.map(letter => (
          <div key={letter} id={`letter-${letter}`}>
            <h3 className="text-xl font-bold text-[#32a191] mb-4 border-b border-gray-200 pb-2">
              {letter}
            </h3>
            <ul className="space-y-4">
              {groupedTerms[letter].map(term => (
                <li key={term._id} className="border-b border-gray-100 pb-4">
                  <div className="flex justify-between items-center">
                    <Link 
                      href={`/glossary/${term.slug}`}
                      className="font-medium text-[#002F42] hover:text-[#32a191] transition-colors"
                    >
                      {term.term}
                    </Link>
                    
                    <button
                      onClick={() => toggleTerm(term._id)}
                      className="text-xl text-[#32a191] hover:text-[#002F42] transition-colors"
                      aria-label={expandedTerm === term._id ? "סגור הגדרה" : "הצג הגדרה"}
                    >
                      {expandedTerm === term._id ? '−' : '+'}
                    </button>
                  </div>
                  
                  {expandedTerm === term._id && (
                    <div className="mt-2 text-gray-700">
                      <div dangerouslySetInnerHTML={{ __html: term.definition }} />
                      <Link 
                        href={`/glossary/${term.slug}`}
                        className="text-[#32a191] hover:text-[#002F42] transition-colors text-sm inline-block mt-2"
                      >
                        למידע נוסף ←
                      </Link>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
} 
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
  category?: string; // Add optional category field
  difficulty?: 'מתחילים' | 'בינוני' | 'מתקדם'; // Add optional difficulty level field
}

export default function Glossary() {
  const [terms, setTerms] = useState<FinancialTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  
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

  // Get unique categories
  const categories = Array.from(
    new Set(terms.filter(term => term.category).map(term => term.category))
  ).filter(Boolean) as string[];

  // Get unique difficulty levels
  const difficultyLevels = Array.from(
    new Set(terms.filter(term => term.difficulty).map(term => term.difficulty))
  ).filter(Boolean) as string[];

  // If no terms have difficulty set, use default levels for UI display
  const defaultDifficultyLevels = difficultyLevels.length > 0 ? 
    difficultyLevels : ['מתחילים', 'בינוני', 'מתקדם'];

  // Filter terms based on search query, category, and difficulty
  const filteredTerms = terms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || term.category === selectedCategory;
    const matchesDifficulty = !selectedDifficulty || term.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });
  
  // Group terms alphabetically
  const groupedTerms: { [key: string]: FinancialTerm[] } = {};
  
  filteredTerms.forEach(term => {
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

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedLetter(null); // Reset letter filter when searching
  };

  // Handle letter filter
  const handleLetterClick = (letter: string) => {
    if (selectedLetter === letter) {
      setSelectedLetter(null);
    } else {
      setSelectedLetter(letter);
      setSearchQuery(''); // Clear search when filtering by letter
    }
  };

  // Handle category filter
  const handleCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };

  // Handle difficulty filter
  const handleDifficultyClick = (difficulty: string) => {
    if (selectedDifficulty === difficulty) {
      setSelectedDifficulty(null);
    } else {
      setSelectedDifficulty(difficulty);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedLetter(null);
    setSelectedCategory(null);
    setSelectedDifficulty(null);
  };

  // Get the terms to display based on letter filter
  const termsToDisplay = selectedLetter 
    ? { [selectedLetter]: groupedTerms[selectedLetter] }
    : groupedTerms;

  // Get letters for display
  const displayLetters = selectedLetter ? [selectedLetter] : sortedLetters;

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
      
      {/* Search and Filter Section */}
      <div className="flex flex-col items-center mb-8">
        {/* Search Bar - Centered and narrower */}
        <div className="w-full max-w-md mx-auto mb-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="חיפוש מונח..."
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#32a191] focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-gray-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filter Dropdowns */}
        <div className="w-full max-w-md mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Dropdown */}
          {categories.length > 0 && (
            <div>
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#32a191] focus:border-transparent"
              >
                <option value="">כל הקטגוריות</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Difficulty Level Dropdown */}
          <div>
            <select
              value={selectedDifficulty || ''}
              onChange={(e) => setSelectedDifficulty(e.target.value || null)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#32a191] focus:border-transparent"
            >
              <option value="">כל הרמות</option>
              {defaultDifficultyLevels.map(level => (
                <option key={level} value={level}>
                  {level === 'מתחילים' ? 'מתחילים' : 
                   level === 'בינוני' ? 'בינוני' : 'מתקדם'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Active Filters Display */}
      {(selectedCategory || selectedLetter || searchQuery || selectedDifficulty) && (
        <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-500">סינון פעיל:</span>
          
          {selectedCategory && (
            <span className="px-3 py-1 bg-[#32a191] text-white rounded-full text-sm flex items-center">
              {selectedCategory}
              <button 
                onClick={() => setSelectedCategory(null)}
                className="ml-2 focus:outline-none"
              >
                ✕
              </button>
            </span>
          )}
          
          {selectedDifficulty && (
            <span className="px-3 py-1 bg-[#32a191] text-white rounded-full text-sm flex items-center">
              רמה: {selectedDifficulty}
              <button 
                onClick={() => setSelectedDifficulty(null)}
                className="ml-2 focus:outline-none"
              >
                ✕
              </button>
            </span>
          )}
          
          {selectedLetter && (
            <span className="px-3 py-1 bg-[#32a191] text-white rounded-full text-sm flex items-center">
              אות: {selectedLetter}
              <button 
                onClick={() => setSelectedLetter(null)}
                className="ml-2 focus:outline-none"
              >
                ✕
              </button>
            </span>
          )}
          
          {searchQuery && (
            <span className="px-3 py-1 bg-[#32a191] text-white rounded-full text-sm flex items-center">
              חיפוש: {searchQuery}
              <button 
                onClick={() => setSearchQuery('')}
                className="ml-2 focus:outline-none"
              >
                ✕
              </button>
            </span>
          )}
          
          <button
            onClick={resetFilters}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm hover:bg-gray-300 transition-colors"
          >
            נקה הכל
          </button>
        </div>
      )}
      
      {/* Letter index */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {sortedLetters.map(letter => (
          <button 
            key={letter}
            onClick={() => handleLetterClick(letter)}
            className={`inline-block w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors ${
              selectedLetter === letter 
                ? 'bg-[#32a191] text-white' 
                : 'bg-[#f5f5f5] text-[#002F42] hover:bg-[#e5e5e5]'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>
      
      {/* No results message */}
      {filteredTerms.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">לא נמצאו מונחים תואמים את החיפוש</p>
          <button
            onClick={resetFilters}
            className="mt-4 px-4 py-2 bg-[#32a191] text-white rounded-md hover:bg-[#2a8a7c] transition-colors"
          >
            הצג את כל המונחים
          </button>
        </div>
      )}
      
      {/* Terms list */}
      {filteredTerms.length > 0 && (
        <div className="space-y-8">
          {displayLetters.map(letter => (
            <div key={letter} id={`letter-${letter}`}>
              <h3 className="text-xl font-bold text-[#32a191] mb-4 border-b border-gray-200 pb-2">
                {letter}
              </h3>
              <ul className="space-y-4">
                {groupedTerms[letter].map(term => (
                  <li key={term._id} className="border-b border-gray-100 pb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <Link 
                          href={`/glossary/${term.slug}`}
                          className="font-medium text-[#002F42] hover:text-[#32a191] transition-colors"
                        >
                          {term.term}
                        </Link>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {term.category && (
                            <span 
                              className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full"
                              onClick={() => handleCategoryClick(term.category as string)}
                              style={{ cursor: 'pointer' }}
                            >
                              {term.category}
                            </span>
                          )}
                          {term.difficulty && (
                            <span 
                              className={`px-2 py-0.5 text-xs rounded-full ${
                                term.difficulty === 'מתחילים' ? 'bg-green-100 text-green-700' : 
                                term.difficulty === 'בינוני' ? 'bg-yellow-100 text-yellow-700' : 
                                'bg-red-100 text-red-700'
                              }`}
                              onClick={() => handleDifficultyClick(term.difficulty as string)}
                              style={{ cursor: 'pointer' }}
                            >
                              {term.difficulty}
                            </span>
                          )}
                        </div>
                      </div>
                      
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
      )}
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

// Default fallback dollar rate
const DEFAULT_DOLLAR_RATE = 3.7;

export default function PortfolioPage() {
  // State for form inputs
  const [dollarRate, setDollarRate] = useState<number | ''>(DEFAULT_DOLLAR_RATE);
  const [portfolioPercentage, setPortfolioPercentage] = useState<number | ''>('');
  const [portfolioValue, setPortfolioValue] = useState<number | ''>('');
  const [stockPrice, setStockPrice] = useState<number | ''>('');
  const [isLoadingRate, setIsLoadingRate] = useState(false);
  const [currencyType, setCurrencyType] = useState<'ILS' | 'USD'>('ILS');
  
  // State for calculation results
  const [result, setResult] = useState<number | null>(null);
  
  // Fetch current dollar rate on page load for internal calculations
  useEffect(() => {
    // Don't try to fetch if we're in a browser extension context
    if (window.location.href.startsWith('chrome-extension://')) {
      return;
    }
    
    const fetchDollarRate = async () => {
      try {
        setIsLoadingRate(true);
        
        // Try a public currency API that supports CORS
        try {
          const response = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=ILS');
          if (response.ok) {
            const data = await response.json();
            const rate = data.rates.ILS;
            if (rate) {
              setDollarRate(rate);
              setIsLoadingRate(false);
              return;
            }
          }
        } catch (error) {
          console.log('Exchange rate API failed, using default value');
        }
        
        // If API fails, use the default value
        setDollarRate(DEFAULT_DOLLAR_RATE);
      } catch (error) {
        console.error('Exchange rate API failed:', error);
        setDollarRate(DEFAULT_DOLLAR_RATE);
      } finally {
        setIsLoadingRate(false);
      }
    };
    
    fetchDollarRate();
  }, []);
  
  // Handle calculation
  const calculateStockAmount = () => {
    if (portfolioPercentage === '' || 
        portfolioValue === '' || 
        stockPrice === '') {
      return;
    }

    // Convert input values
    const dollar = typeof dollarRate === 'string' ? parseFloat(dollarRate) : dollarRate;
    const percentage = typeof portfolioPercentage === 'string' ? parseFloat(portfolioPercentage) : portfolioPercentage;
    const portfolio = typeof portfolioValue === 'string' ? parseFloat(portfolioValue) : portfolioValue;
    const stock = typeof stockPrice === 'string' ? parseFloat(stockPrice) : stockPrice;
    
    // Calculate the result (how many stocks to buy)
    let stocksToBuy;
    
    if (currencyType === 'ILS') {
      // If portfolio is in ILS and stock price is in ILS
      // Formula: (Portfolio Value in ILS * Percentage) / Stock Price in ILS
      stocksToBuy = (portfolio * (percentage / 100)) / stock;
    } else {
      // If portfolio is in USD and stock price is in USD
      // Formula: (Portfolio Value in USD * Percentage) / Stock Price in USD
      stocksToBuy = (portfolio * (percentage / 100)) / stock;
    }
    
    // Update state with result
    setResult(Math.floor(stocksToBuy)); // Floor to get whole number of stocks
  };
  
  // Toggle between USD and ILS input
  const toggleCurrency = (currency: 'ILS' | 'USD') => {
    setCurrencyType(currency);
    // Reset stock price when changing currency type
    setStockPrice('');
  };
  
  // Reset form
  const resetForm = () => {
    setPortfolioPercentage('');
    setPortfolioValue('');
    setStockPrice('');
    setResult(null);
  };
  
  return (
    <>
      {/* Header Banner */}
      <div className="bg-[#002F42] py-6 mb-8">
        <MaxWidthWrapper>
          <h1 className="text-white text-center text-5xl md:text-6xl font-bold mb-2">
            פעימות <span className="font-semibold text-5xl">לתיקי השקעות</span>
          </h1>
        </MaxWidthWrapper>
      </div>
      
      <MaxWidthWrapper className="mb-16">
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-10">
          <div className="text-center mb-6">
            <p className="text-lg text-gray-700" dir="rtl">
              כלי זה מאפשר לכם לחשב את המספר המדויק של מניות שכדאי לרכוש על פי הפרמטרים שתזינו
            </p>
          </div>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              calculateStockAmount();
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            dir="rtl"
          >
            {/* Currency Toggle */}
            <div className="md:col-span-2 flex justify-center mb-4">
              <div className="flex items-center bg-gray-100 rounded-lg p-2">
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg transition-colors ${currencyType === 'ILS' ? 'bg-[#32a191] text-white' : 'bg-transparent text-gray-700'}`}
                  onClick={() => toggleCurrency('ILS')}
                >
                  פעימות בשקל (₪)
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded-lg transition-colors ${currencyType === 'USD' ? 'bg-[#32a191] text-white' : 'bg-transparent text-gray-700'}`}
                  onClick={() => toggleCurrency('USD')}
                >
                  פעימות בדולר ($)
                </button>
              </div>
            </div>
            
            {/* Basic Inputs */}
            <div className="flex flex-col">
              <label htmlFor="portfolioPercentage" className="mb-2 font-medium text-[#002F42]">
                אחוז רצוי מהתיק (%):
              </label>
              <input
                id="portfolioPercentage"
                type="number"
                value={portfolioPercentage}
                onChange={(e) => setPortfolioPercentage(e.target.value ? Number(e.target.value) : '')}
                placeholder="5"
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                dir="rtl"
                min="0"
                max="100"
                step="0.1"
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="portfolioValue" className="mb-2 font-medium text-[#002F42]">
                שווי התיק {currencyType === 'ILS' ? '(₪)' : '($)'}:
              </label>
              <input
                id="portfolioValue"
                type="number"
                value={portfolioValue}
                onChange={(e) => setPortfolioValue(e.target.value ? Number(e.target.value) : '')}
                placeholder={currencyType === 'ILS' ? "100000" : "30000"}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                dir="rtl"
                min="0"
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="stockPrice" className="mb-2 font-medium text-[#002F42]">
                מחיר מניה {currencyType === 'ILS' ? '(₪)' : '($)'}:
              </label>
              <input
                id="stockPrice"
                type="number"
                value={stockPrice}
                onChange={(e) => setStockPrice(e.target.value ? Number(e.target.value) : '')}
                placeholder={currencyType === 'ILS' ? "50" : "150"}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                dir="rtl"
                min="0"
                step="0.01"
              />
            </div>
            
            {currencyType === 'USD' && (
              <div className="flex flex-col">
                <div className="mb-2 font-medium text-[#002F42]">
                  שער הדולר: 
                  {isLoadingRate ? (
                    <span className="text-gray-400 text-sm mr-2">טוען...</span>
                  ) : (
                    <span className="text-gray-600 text-sm mr-2">{typeof dollarRate === 'number' ? dollarRate.toFixed(2) : '3.70'} ₪</span>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  שער זה משמש לחישוב פנימי בלבד ומתעדכן אוטומטית
                </div>
              </div>
            )}
            
            {/* Empty div to maintain layout when in ILS mode */}
            {currencyType === 'ILS' && (
              <div className="flex flex-col">
                {/* Empty spacer to maintain layout */}
              </div>
            )}
            
            {/* Submit and Reset Buttons */}
            <div className="md:col-span-2 flex justify-center gap-4 mt-4">
              <button
                type="submit"
                className="bg-[#32a191] text-white py-3 px-8 rounded-lg text-xl font-medium hover:bg-[#002F42] transition-colors"
              >
                חשב
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 py-3 px-8 rounded-lg text-xl font-medium hover:bg-gray-400 transition-colors"
              >
                נקה
              </button>
            </div>
          </form>
        </div>
        
        {/* Results Section */}
        {result !== null && (
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-10">
            <h2 className="text-2xl font-bold text-[#002F42] mb-6 text-center" dir="rtl">
              תוצאות החישוב:
            </h2>
            
            <div className="text-center" dir="rtl">
              <div className="mb-4">
                <span className="text-gray-600 mb-1">כמות המניות שכדאי לרכוש:</span>
                <div className="text-4xl font-bold text-[#32a191]">{result}</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg max-w-md mx-auto">
                <p className="text-gray-600">
                  <strong>הערה:</strong> מספר המניות מעוגל כלפי מטה למספר השלם הקרוב. 
                  זוהי המלצה בלבד ואינה מהווה ייעוץ השקעות מקצועי.
                </p>
              </div>
            </div>
          </div>
        )}
      </MaxWidthWrapper>
    </>
  );
} 
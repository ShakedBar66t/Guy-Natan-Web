'use client';

import { useState, useEffect } from 'react';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

// Default fallback dollar rate
const DEFAULT_DOLLAR_RATE = 3.7;

export default function PortfolioPage() {
  // State for form inputs
  const [dollarRate, setDollarRate] = useState<number | ''>(DEFAULT_DOLLAR_RATE);
  const [portfolioPercentage, setPortfolioPercentage] = useState<string>('');
  const [portfolioValue, setPortfolioValue] = useState<string>('');
  const [stockPrice, setStockPrice] = useState<string>('');
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
        
        // Try multiple exchange rate APIs in case one fails
        const apis = [
          // Open Exchange Rates API (fallback)
          'https://open.er-api.com/v6/latest/USD',
          // Exchange Rate API
          'https://api.exchangerate.host/latest?base=USD&symbols=ILS',
          // Exchange Rate API v2
          'https://api.exchangerate-api.com/v4/latest/USD'
        ];
        
        for (const apiUrl of apis) {
          try {
            const response = await fetch(apiUrl);
            if (response.ok) {
              const data = await response.json();
              // Different APIs have different response structures
              const rate = data.rates?.ILS || data.rates?.ils;
              
              if (rate && typeof rate === 'number' && !isNaN(rate)) {
                console.log(`Successfully fetched exchange rate: ${rate} from ${apiUrl}`);
                setDollarRate(parseFloat(rate.toFixed(2)));
                return;
              }
            }
          } catch (err) {
            console.log(`API ${apiUrl} failed, trying next...`);
            continue;
          }
        }
        
        // If all APIs fail, use the default value
        console.log('All exchange rate APIs failed, using default value');
        setDollarRate(DEFAULT_DOLLAR_RATE);
      } catch (error) {
        console.error('Exchange rate API failed:', error);
        setDollarRate(DEFAULT_DOLLAR_RATE);
      } finally {
        setIsLoadingRate(false);
      }
    };
    
    fetchDollarRate();
    
    // Set up interval to refresh the rate every hour
    const intervalId = setInterval(fetchDollarRate, 60 * 60 * 1000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);
  
  // Function to format numbers with commas for thousands
  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Function to format input value with commas
  const formatInputValue = (value: string): string => {
    // Remove any non-digit characters except for decimal point
    const numericValue = value.replace(/[^\d.]/g, '');
    
    if (numericValue === '') return '';
    
    // Check if it has a decimal part
    if (numericValue.includes('.')) {
      const [intPart, decimalPart] = numericValue.split('.');
      return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + decimalPart;
    }
    
    // Format only the integer part
    return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Function to parse value from formatted string
  const parseFormattedValue = (value: string): number => {
    // Remove commas and convert to number
    return parseFloat(value.replace(/,/g, '')) || 0;
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Allow only numbers and dots
    const sanitizedValue = value.replace(/[^\d.]/g, '');
    
    switch (name) {
      case 'portfolioPercentage':
        setPortfolioPercentage(sanitizedValue);
        break;
      case 'portfolioValue':
        setPortfolioValue(sanitizedValue);
        break;
      case 'stockPrice':
        setStockPrice(sanitizedValue);
        break;
    }
  };

  // Handle blur event to format input value
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '') return;
    
    const formattedValue = formatInputValue(value);
    
    switch (name) {
      case 'portfolioPercentage':
        setPortfolioPercentage(formattedValue);
        break;
      case 'portfolioValue':
        setPortfolioValue(formattedValue);
        break;
      case 'stockPrice':
        setStockPrice(formattedValue);
        break;
    }
  };
  
  // Handle calculation
  const calculateStockAmount = () => {
    if (portfolioPercentage === '' || 
        portfolioValue === '' || 
        stockPrice === '') {
      return;
    }

    // Convert input values
    const dollar = typeof dollarRate === 'number' ? dollarRate : DEFAULT_DOLLAR_RATE;
    const percentage = parseFormattedValue(portfolioPercentage);
    const portfolio = parseFormattedValue(portfolioValue);
    const stock = parseFormattedValue(stockPrice);
    
    // Calculate the result (how many stocks to buy)
    let stocksToBuy;
    
    if (currencyType === 'ILS') {
      // If stock price is in ILS
      // Formula: (Portfolio Value in ILS * Percentage) / Stock Price in ILS
      stocksToBuy = (portfolio * (percentage / 100)) / stock;
    } else {
      // If stock price is in USD
      // Portfolio value is always in ILS, so we need to convert it to USD first
      const portfolioInUSD = portfolio / dollar;
      // Formula: (Portfolio Value in USD * Percentage) / Stock Price in USD
      stocksToBuy = (portfolioInUSD * (percentage / 100)) / stock;
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
      <div className="bg-white py-6 mb-8">
        <MaxWidthWrapper>
          <h1 className="text-[#002F42] text-center text-5xl md:text-6xl font-bold mb-2">
            פעימות <span className="font-normal">לתיקי השקעות</span>
          </h1>
        </MaxWidthWrapper>
      </div>
      
      <MaxWidthWrapper className="mb-16">
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-10 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-lg text-gray-700 text-center mx-auto" dir="rtl">
              כלי זה מאפשר לכם לחשב את המספר המדויק של מניות שכדאי לרכוש על פי הפרמטרים שתזינו
            </p>
          </div>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              calculateStockAmount();
            }}
            className="grid grid-cols-1 gap-6 items-center justify-items-center"
            dir="rtl"
          >
            {/* Currency Toggle */}
            <div className="flex justify-center mb-4 w-full">
              <div className="flex items-center bg-gray-100 rounded-lg p-1 w-48">
                <button
                  type="button"
                  className={`flex-1 px-3 py-1.5 rounded-lg transition-colors ${currencyType === 'ILS' ? 'bg-[#32a191] text-white' : 'bg-transparent text-gray-700'}`}
                  onClick={() => toggleCurrency('ILS')}
                >
                  שקל (₪)
                </button>
                <button
                  type="button"
                  className={`flex-1 px-3 py-1.5 rounded-lg transition-colors ${currencyType === 'USD' ? 'bg-[#32a191] text-white' : 'bg-transparent text-gray-700'}`}
                  onClick={() => toggleCurrency('USD')}
                >
                  דולר ($)
                </button>
              </div>
            </div>
            
            {/* Basic Inputs */}
            <div className="flex flex-col items-center w-full">
              <label htmlFor="portfolioValue" className="mb-2 font-medium text-[#002F42] text-center">
                שווי התיק (₪):
              </label>
              <input
                id="portfolioValue"
                name="portfolioValue"
                type="text"
                value={portfolioValue}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="100000"
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#32a191] w-48 text-center"
                dir="rtl"
              />
            </div>
            
            <div className="flex flex-col items-center w-full">
              <label htmlFor="portfolioPercentage" className="mb-2 font-medium text-[#002F42] text-center">
                אחוז רצוי מהתיק (%):
              </label>
              <div className="relative w-48">
                <input
                  id="portfolioPercentage"
                  name="portfolioPercentage"
                  type="text"
                  value={portfolioPercentage}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="5"
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#32a191] text-center pr-8"
                  dir="rtl"
                />
                {portfolioPercentage && (
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">%</span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col items-center w-full">
              <label htmlFor="stockPrice" className="mb-2 font-medium text-[#002F42] text-center">
                מחיר מניה {currencyType === 'ILS' ? '(₪)' : '($)'}:
              </label>
              <input
                id="stockPrice"
                name="stockPrice"
                type="text"
                value={stockPrice}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={currencyType === 'ILS' ? "50" : "150"}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#32a191] w-48 text-center"
                dir="rtl"
              />
            </div>
            
            {currencyType === 'USD' && (
              <div className="flex flex-col items-center w-full">
                <div className="mb-2 font-medium text-[#002F42] text-center">
                  שער הדולר: 
                  {isLoadingRate ? (
                    <span className="text-gray-400 text-sm mr-2">טוען...</span>
                  ) : (
                    <span className="text-gray-600 text-sm mr-2">{typeof dollarRate === 'number' ? dollarRate.toFixed(2) : '3.70'} ₪</span>
                  )}
                </div>
                <div className="text-xs text-gray-500 w-48 text-center mx-auto">
                  שער זה מתעדכן אוטומטית ומשמש לחישובים פנימיים בלבד
                </div>
              </div>
            )}
            
            {/* Submit and Reset Buttons */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                type="submit"
                className="bg-[#32a191] text-white py-3 px-6 rounded-lg text-xl font-medium hover:bg-[#002F42] transition-colors w-24"
              >
                חשב
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 py-3 px-6 rounded-lg text-xl font-medium hover:bg-gray-400 transition-colors w-24"
              >
                נקה
              </button>
            </div>
          </form>
        </div>
        
        {/* Results Section */}
        {result !== null && (
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-10 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-[#002F42] mb-6 text-center" dir="rtl">
              תוצאות החישוב:
            </h2>
            
            <div className="text-center flex flex-col items-center" dir="rtl">
              <div className="mb-4">
                <span className="text-gray-600 mb-1 block text-center">כמות המניות שכדאי לרכוש:</span>
                <div className="text-4xl font-bold text-[#32a191] text-center">{formatNumber(result)}</div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg max-w-md mx-auto">
                <p className="text-gray-600 text-center">
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
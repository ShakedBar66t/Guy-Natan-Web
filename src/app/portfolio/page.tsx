'use client';

import { useState, useEffect } from 'react';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

export default function PortfolioPage() {
  // State for form inputs
  const [portfolioValue, setPortfolioValue] = useState<number | ''>('');
  const [stockPercentage, setStockPercentage] = useState<number | ''>(70);
  const [bondPercentage, setBondPercentage] = useState<number | ''>(20);
  const [cashPercentage, setCashPercentage] = useState<number | ''>(10);
  const [riskTolerance, setRiskTolerance] = useState<string>('medium');
  const [investmentHorizon, setInvestmentHorizon] = useState<number | ''>(10);
  
  // State for calculation results
  const [expectedReturn, setExpectedReturn] = useState<number | null>(null);
  const [riskLevel, setRiskLevel] = useState<string | null>(null);
  const [expectedPortfolioValue, setExpectedPortfolioValue] = useState<number | null>(null);
  const [worstCaseScenario, setWorstCaseScenario] = useState<number | null>(null);
  const [bestCaseScenario, setBestCaseScenario] = useState<number | null>(null);
  
  // Effect to ensure allocation adds up to 100%
  useEffect(() => {
    if (typeof stockPercentage === 'number' && 
        typeof bondPercentage === 'number' && 
        typeof cashPercentage === 'number') {
      
      const total = stockPercentage + bondPercentage + cashPercentage;
      
      if (total !== 100) {
        // Adjust the most recently changed value to make the total 100%
        const diff = 100 - total;
        
        // This approach assumes the last input to be changed should be adjusted
        // A more sophisticated approach would be to determine which input was last changed
        if (cashPercentage + diff >= 0) {
          setCashPercentage(cashPercentage + diff);
        } else if (bondPercentage + diff >= 0) {
          setBondPercentage(bondPercentage + diff);
        } else if (stockPercentage + diff >= 0) {
          setStockPercentage(stockPercentage + diff);
        }
      }
    }
  }, [stockPercentage, bondPercentage, cashPercentage]);
  
  // Handle calculation
  const calculatePortfolioMetrics = () => {
    if (portfolioValue === '' || 
        typeof stockPercentage !== 'number' || 
        typeof bondPercentage !== 'number' || 
        typeof cashPercentage !== 'number' || 
        investmentHorizon === '') {
      return;
    }
    
    // Convert input values
    const portfolio = typeof portfolioValue === 'string' ? parseFloat(portfolioValue) : portfolioValue;
    const stocks = stockPercentage / 100;
    const bonds = bondPercentage / 100;
    const cash = cashPercentage / 100;
    const years = typeof investmentHorizon === 'string' ? parseFloat(investmentHorizon) : investmentHorizon;
    
    // Expected return rates (annual)
    const stockReturn = 0.08; // 8% for stocks
    const bondReturn = 0.035; // 3.5% for bonds
    const cashReturn = 0.015; // 1.5% for cash
    
    // Risk levels (standard deviation)
    const stockRisk = 0.18; // 18% for stocks
    const bondRisk = 0.05; // 5% for bonds
    const cashRisk = 0.01; // 1% for cash
    
    // Calculate weighted average return
    const weightedReturn = (stocks * stockReturn) + (bonds * bondReturn) + (cash * cashReturn);
    
    // Calculate portfolio risk (simplified)
    const portfolioRisk = Math.sqrt(
      (stocks * stockRisk) ** 2 + 
      (bonds * bondRisk) ** 2 + 
      (cash * cashRisk) ** 2
    );
    
    // Adjust risk based on risk tolerance
    let riskAdjustment = 1.0;
    if (riskTolerance === 'low') {
      riskAdjustment = 0.8;
    } else if (riskTolerance === 'high') {
      riskAdjustment = 1.2;
    }
    
    // Calculate expected future value (compound interest formula)
    const expectedFutureValue = portfolio * Math.pow(1 + (weightedReturn * riskAdjustment), years);
    
    // Calculate scenarios
    const bestCase = portfolio * Math.pow(1 + (weightedReturn + portfolioRisk), years);
    const worstCase = portfolio * Math.pow(1 + (weightedReturn - portfolioRisk), years);
    
    // Determine risk level text
    let riskLevelText;
    if (portfolioRisk < 0.05) {
      riskLevelText = 'נמוך מאוד';
    } else if (portfolioRisk < 0.10) {
      riskLevelText = 'נמוך';
    } else if (portfolioRisk < 0.15) {
      riskLevelText = 'בינוני';
    } else if (portfolioRisk < 0.20) {
      riskLevelText = 'גבוה';
    } else {
      riskLevelText = 'גבוה מאוד';
    }
    
    // Update state with results
    setExpectedReturn(Math.round(weightedReturn * 100));
    setRiskLevel(riskLevelText);
    setExpectedPortfolioValue(Math.round(expectedFutureValue));
    setWorstCaseScenario(Math.round(worstCase));
    setBestCaseScenario(Math.round(bestCase));
  };
  
  // Reset form
  const resetForm = () => {
    setPortfolioValue('');
    setStockPercentage(70);
    setBondPercentage(20);
    setCashPercentage(10);
    setRiskTolerance('medium');
    setInvestmentHorizon('');
    setExpectedReturn(null);
    setRiskLevel(null);
    setExpectedPortfolioValue(null);
    setWorstCaseScenario(null);
    setBestCaseScenario(null);
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
              כלי זה מאפשר לכם לחשב את הפעימות של תיק ההשקעות שלכם לאורך זמן, ולהעריך את התשואה והסיכון הצפויים.
            </p>
          </div>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              calculatePortfolioMetrics();
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            dir="rtl"
          >
            {/* Basic Inputs */}
            <div className="flex flex-col">
              <label htmlFor="portfolioValue" className="mb-2 font-medium text-[#002F42]">
                שווי תיק ההשקעות הנוכחי:
              </label>
              <input
                id="portfolioValue"
                type="number"
                value={portfolioValue}
                onChange={(e) => setPortfolioValue(e.target.value ? Number(e.target.value) : '')}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                dir="rtl"
                min="0"
              />
            </div>
            
            <div className="flex flex-col">
              <label htmlFor="investmentHorizon" className="mb-2 font-medium text-[#002F42]">
                אופק השקעה (בשנים):
              </label>
              <input
                id="investmentHorizon"
                type="number"
                value={investmentHorizon}
                onChange={(e) => setInvestmentHorizon(e.target.value ? Number(e.target.value) : '')}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                dir="rtl"
                min="1"
                max="50"
              />
            </div>
            
            {/* Portfolio Allocation */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-[#002F42] mb-4">הקצאת נכסים בתיק (סה"כ 100%):</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="stockPercentage" className="mb-2 font-medium text-[#002F42]">
                    מניות (%):
                  </label>
                  <input
                    id="stockPercentage"
                    type="number"
                    value={stockPercentage}
                    onChange={(e) => setStockPercentage(e.target.value ? Number(e.target.value) : '')}
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                    dir="rtl"
                    min="0"
                    max="100"
                  />
                </div>
                
                <div className="flex flex-col">
                  <label htmlFor="bondPercentage" className="mb-2 font-medium text-[#002F42]">
                    אג"ח (%):
                  </label>
                  <input
                    id="bondPercentage"
                    type="number"
                    value={bondPercentage}
                    onChange={(e) => setBondPercentage(e.target.value ? Number(e.target.value) : '')}
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                    dir="rtl"
                    min="0"
                    max="100"
                  />
                </div>
                
                <div className="flex flex-col">
                  <label htmlFor="cashPercentage" className="mb-2 font-medium text-[#002F42]">
                    מזומן (%):
                  </label>
                  <input
                    id="cashPercentage"
                    type="number"
                    value={cashPercentage}
                    onChange={(e) => setCashPercentage(e.target.value ? Number(e.target.value) : '')}
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                    dir="rtl"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>
            
            {/* Risk Tolerance */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-[#002F42] mb-4">סיבולת סיכון:</h3>
              <div className="flex flex-wrap gap-4 justify-center">
                <div className="flex items-center">
                  <input
                    id="riskLow"
                    type="radio"
                    name="riskTolerance"
                    value="low"
                    checked={riskTolerance === 'low'}
                    onChange={() => setRiskTolerance('low')}
                    className="w-4 h-4 text-[#32a191] focus:ring-[#32a191]"
                  />
                  <label htmlFor="riskLow" className="mr-2 font-medium text-[#002F42]">
                    נמוכה
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="riskMedium"
                    type="radio"
                    name="riskTolerance"
                    value="medium"
                    checked={riskTolerance === 'medium'}
                    onChange={() => setRiskTolerance('medium')}
                    className="w-4 h-4 text-[#32a191] focus:ring-[#32a191]"
                  />
                  <label htmlFor="riskMedium" className="mr-2 font-medium text-[#002F42]">
                    בינונית
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="riskHigh"
                    type="radio"
                    name="riskTolerance"
                    value="high"
                    checked={riskTolerance === 'high'}
                    onChange={() => setRiskTolerance('high')}
                    className="w-4 h-4 text-[#32a191] focus:ring-[#32a191]"
                  />
                  <label htmlFor="riskHigh" className="mr-2 font-medium text-[#002F42]">
                    גבוהה
                  </label>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-center mt-4">
              <button
                type="submit"
                className="bg-[#32a191] text-white py-3 px-8 rounded-lg text-xl font-medium hover:bg-[#002F42] transition-colors"
              >
                חשב
              </button>
            </div>
          </form>
        </div>
        
        {/* Results Section */}
        {expectedReturn !== null && (
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-10">
            <h2 className="text-2xl font-bold text-[#002F42] mb-6 text-center" dir="rtl">
              תוצאות ניתוח התיק:
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" dir="rtl">
              <div className="flex flex-col">
                <span className="text-gray-600 mb-1">תשואה שנתית ממוצעת צפויה:</span>
                <span className="text-2xl font-bold text-[#002F42]">{expectedReturn}%</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-gray-600 mb-1">רמת סיכון:</span>
                <span className="text-2xl font-bold text-[#002F42]">{riskLevel}</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-gray-600 mb-1">שווי תיק צפוי לאחר {investmentHorizon} שנים:</span>
                <span className="text-2xl font-bold text-[#32a191]">{expectedPortfolioValue?.toLocaleString()} ש"ח</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-gray-600 mb-1">תרחיש אופטימי:</span>
                <span className="text-2xl font-bold text-green-600">{bestCaseScenario?.toLocaleString()} ש"ח</span>
              </div>
              
              <div className="flex flex-col md:col-span-2">
                <span className="text-gray-600 mb-1">תרחיש פסימי:</span>
                <span className="text-2xl font-bold text-red-500">{worstCaseScenario?.toLocaleString()} ש"ח</span>
              </div>
              
              <div className="flex flex-col md:col-span-2 bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">
                  <strong>הערה:</strong> תוצאות אלו מבוססות על הנחות היסטוריות והערכות שוק. התשואות בפועל עשויות להיות שונות.
                  מומלץ להתייעץ עם יועץ פיננסי מקצועי לפני קבלת החלטות השקעה.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Newsletter Section */}
        <div className="bg-[#32a191] text-white rounded-lg p-8 mb-16" dir="rtl">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">
              לקבלת ייעוץ אישי והצעת תיק השקעות מותאם
            </h3>
            <p className="text-lg">
              השאירו פרטים ונחזור אליכם עם מידע נוסף
            </p>
          </div>
          <form className="max-w-md mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="שם מלא"
              required
              dir="rtl"
              className="md:col-span-2 p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <input
              type="email"
              placeholder="כתובת דוא״ל"
              required
              dir="rtl"
              className="p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <input
              type="tel"
              placeholder="טלפון"
              required
              dir="rtl"
              className="p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="md:col-span-2 bg-white text-[#32a191] font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              שליחה
            </button>
          </form>
        </div>
        
        {/* Info Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16" dir="rtl">
          <div className="bg-gray-100 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-[#002F42] mb-4">איך לבנות תיק השקעות מאוזן?</h3>
            <p className="text-gray-700 mb-4">
              תיק השקעות מאוזן נכון משלב בין נכסים בעלי רמות סיכון שונות. ההקצאה הנכונה תלויה בגורמים רבים כמו גיל, מטרות פיננסיות ואופק השקעה.
            </p>
            <p className="text-gray-700">
              עקרון הפיזור הוא אחד מאבני היסוד של השקעה חכמה - השקעה במגוון נכסים, ענפים ואזורים גיאוגרפיים מפחיתה את הסיכון הכולל של התיק שלכם.
              כדאי לעקוב אחר ביצועי התיק באופן קבוע ולבצע איזון מחדש כאשר ההקצאה סוטה מהיעדים שהגדרתם.
            </p>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-6">
            <h3 className="text-2xl font-bold text-[#002F42] mb-4">למה חשוב לעקוב אחר פעימות התיק?</h3>
            <p className="text-gray-700 mb-4">
              פעימות התיק מייצגות את התנודתיות וההתפתחות של ההשקעות שלכם לאורך זמן. מעקב אחר פעימות אלה מאפשר לכם להבין טוב יותר את הביצועים, לזהות מגמות ולקבל החלטות מושכלות לגבי התאמות נדרשות.
            </p>
            <p className="text-gray-700">
              תיקי השקעות יעילים אינם סטטיים - הם דורשים התאמות מעת לעת בהתאם לשינויים בשווקים, במצבכם הפיננסי ובמטרותיכם. כלי זה מסייע לכם לראות את התמונה הגדולה ולתכנן את עתידכם הפיננסי בצורה טובה יותר.
            </p>
          </div>
        </div>
      </MaxWidthWrapper>
    </>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

export default function CalculatorPage() {
  // State for form inputs
  const [initialAmount, setInitialAmount] = useState<number | ''>('');
  const [monthlyDeposit, setMonthlyDeposit] = useState<number | ''>('');
  const [annualInterestRate, setAnnualInterestRate] = useState<number | ''>('');
  const [years, setYears] = useState<number | ''>('');
  const [includeManagementFees, setIncludeManagementFees] = useState(false);
  const [depositFeeRate, setDepositFeeRate] = useState<number | ''>('');
  const [accumulationFeeRate, setAccumulationFeeRate] = useState<number | ''>('');
  
  // State for calculation results
  const [totalDeposit, setTotalDeposit] = useState<number | null>(null);
  const [interestProfit, setInterestProfit] = useState<number | null>(null);
  const [futureValue, setFutureValue] = useState<number | null>(null);
  const [depositFees, setDepositFees] = useState<number | null>(null);
  const [accumulationFees, setAccumulationFees] = useState<number | null>(null);

  // Handle calculation
  const calculateCompoundInterest = () => {
    if (initialAmount === '' || monthlyDeposit === '' || annualInterestRate === '' || years === '') {
      return;
    }

    const initial = typeof initialAmount === 'string' ? parseFloat(initialAmount) : initialAmount;
    const monthly = typeof monthlyDeposit === 'string' ? parseFloat(monthlyDeposit) : monthlyDeposit;
    const rate = typeof annualInterestRate === 'string' ? parseFloat(annualInterestRate) / 100 : annualInterestRate / 100;
    const monthlyRate = rate / 12;
    const totalMonths = (typeof years === 'string' ? parseFloat(years) : years) * 12;
    
    let depositFeeRateValue = 0;
    let accumulationFeeRateValue = 0;
    
    if (includeManagementFees) {
      depositFeeRateValue = typeof depositFeeRate === 'string' ? parseFloat(depositFeeRate) / 100 : depositFeeRate / 100;
      accumulationFeeRateValue = typeof accumulationFeeRate === 'string' ? parseFloat(accumulationFeeRate) / 100 : accumulationFeeRate / 100;
    }

    let balance = initial;
    let totalDepositValue = initial;
    let totalDepositFees = 0;
    let totalAccumulationFees = 0;

    for (let i = 0; i < totalMonths; i++) {
      // Calculate deposit fee
      const depositFee = monthly * depositFeeRateValue;
      totalDepositFees += depositFee;
      
      // Add monthly deposit after fee
      const effectiveDeposit = monthly - depositFee;
      balance += effectiveDeposit;
      totalDepositValue += monthly;
      
      // Calculate interest
      const monthlyInterest = balance * monthlyRate;
      
      // Calculate accumulation fee
      const accumulationFee = balance * (accumulationFeeRateValue / 12);
      totalAccumulationFees += accumulationFee;
      
      // Add interest and subtract accumulation fee
      balance += monthlyInterest - accumulationFee;
    }

    // Set results
    setTotalDeposit(Math.round(totalDepositValue));
    setFutureValue(Math.round(balance));
    setInterestProfit(Math.round(balance - totalDepositValue));
    setDepositFees(Math.round(totalDepositFees));
    setAccumulationFees(Math.round(totalAccumulationFees));
  };

  // Reset form
  const resetForm = () => {
    setInitialAmount('');
    setMonthlyDeposit('');
    setAnnualInterestRate('');
    setYears('');
    setIncludeManagementFees(false);
    setDepositFeeRate('');
    setAccumulationFeeRate('');
    setTotalDeposit(null);
    setInterestProfit(null);
    setFutureValue(null);
    setDepositFees(null);
    setAccumulationFees(null);
  };

  return (
    <>
      {/* Header Banner */}
      <div className="bg-[#002F42] py-6 mb-8">
        <MaxWidthWrapper>
          <h1 className="text-white text-center text-5xl md:text-6xl font-bold mb-2">
            חישוב ריבית <span className="font-semibold text-5xl">דריבית</span>
          </h1>
        </MaxWidthWrapper>
      </div>

      <MaxWidthWrapper className="mb-16">
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-10">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              calculateCompoundInterest();
            }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            dir="rtl"
          >
            {/* Basic Inputs */}
            <div className="flex flex-col">
              <label htmlFor="initialAmount" className="mb-2 font-medium text-[#002F42]">
                סכום הפקדה ראשוני:
              </label>
              <input
                id="initialAmount"
                type="number"
                value={initialAmount}
                onChange={(e) => setInitialAmount(e.target.value ? Number(e.target.value) : '')}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                dir="rtl"
                min="0"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="monthlyDeposit" className="mb-2 font-medium text-[#002F42]">
                סכום הפקדה חודשי:
              </label>
              <input
                id="monthlyDeposit"
                type="number"
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(e.target.value ? Number(e.target.value) : '')}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                dir="rtl"
                min="0"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="interestRate" className="mb-2 font-medium text-[#002F42]">
                ריבית שנתית (באחוזים):
              </label>
              <input
                id="interestRate"
                type="number"
                value={annualInterestRate}
                onChange={(e) => setAnnualInterestRate(e.target.value ? Number(e.target.value) : '')}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                dir="rtl"
                min="0"
                step="0.01"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="years" className="mb-2 font-medium text-[#002F42]">
                מספר שנות הפקדה:
              </label>
              <input
                id="years"
                type="number"
                value={years}
                onChange={(e) => setYears(e.target.value ? Number(e.target.value) : '')}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                dir="rtl"
                min="1"
                max="50"
              />
            </div>

            {/* Management Fees Toggle */}
            <div className="md:col-span-2 mt-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="managementFees"
                  checked={includeManagementFees}
                  onChange={(e) => setIncludeManagementFees(e.target.checked)}
                  className="w-4 h-4 text-[#32a191] focus:ring-[#32a191]"
                />
                <label htmlFor="managementFees" className="mr-2 font-medium text-[#002F42]">
                  הוסף דמי ניהול
                </label>
              </div>
            </div>

            {/* Management Fees Inputs (Conditional) */}
            {includeManagementFees && (
              <>
                <div className="flex flex-col">
                  <label htmlFor="depositFee" className="mb-2 font-medium text-[#002F42]">
                    דמי ניהול מהפקדה (באחוזים):
                  </label>
                  <input
                    id="depositFee"
                    type="number"
                    value={depositFeeRate}
                    onChange={(e) => setDepositFeeRate(e.target.value ? Number(e.target.value) : '')}
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                    dir="rtl"
                    min="0"
                    max="10"
                    step="0.01"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="accumulationFee" className="mb-2 font-medium text-[#002F42]">
                    דמי ניהול מהצבירה (באחוזים):
                  </label>
                  <input
                    id="accumulationFee"
                    type="number"
                    value={accumulationFeeRate}
                    onChange={(e) => setAccumulationFeeRate(e.target.value ? Number(e.target.value) : '')}
                    className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                    dir="rtl"
                    min="0"
                    max="5"
                    step="0.01"
                  />
                </div>
              </>
            )}

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
        {futureValue !== null && (
          <div className="bg-white rounded-xl shadow-md p-6 md:p-8 mb-10">
            <h2 className="text-2xl font-bold text-[#002F42] mb-6 text-center" dir="rtl">
              תוצאות:
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" dir="rtl">
              <div className="flex flex-col">
                <span className="text-gray-600 mb-1">סכום ההפקדה הכולל:</span>
                <span className="text-2xl font-bold text-[#002F42]">{totalDeposit?.toLocaleString()} ש"ח</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-gray-600 mb-1">רווח מהריבית דריבית:</span>
                <span className="text-2xl font-bold text-green-600">{interestProfit?.toLocaleString()} ש"ח</span>
              </div>
              
              <div className="flex flex-col">
                <span className="text-gray-600 mb-1">סכום החיסכון העתידי:</span>
                <span className="text-2xl font-bold text-[#32a191]">{futureValue?.toLocaleString()} ש"ח</span>
              </div>
              
              {includeManagementFees && (
                <>
                  <div className="flex flex-col">
                    <span className="text-gray-600 mb-1">דמי ניהול מהפקדה:</span>
                    <span className="text-2xl font-bold text-red-500">{depositFees?.toLocaleString()} ש"ח</span>
                  </div>
                  
                  <div className="flex flex-col md:col-span-2">
                    <span className="text-gray-600 mb-1">דמי ניהול מצבירה:</span>
                    <span className="text-2xl font-bold text-red-500">{accumulationFees?.toLocaleString()} ש"ח</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Newsletter Section */}
        <div className="bg-[#32a191] text-white rounded-lg p-8 mb-16" dir="rtl">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">
              לקבלת פרטים נוספים עבור תוכנית ההכשרה
            </h3>
          </div>
          <form className="max-w-md mx-auto flex flex-col md:flex-row gap-4">
            <input
              type="email"
              placeholder="כתובת דוא״ל"
              required
              dir="rtl"
              className="flex-1 p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="bg-white text-[#32a191] font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
            >
              שליחה
            </button>
          </form>
        </div>
      </MaxWidthWrapper>
    </>
  );
} 
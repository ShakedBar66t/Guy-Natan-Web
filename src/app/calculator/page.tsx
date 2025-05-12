'use client';

import { useState, useEffect } from 'react';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';

export default function CalculatorPage() {
  // State for form inputs
  const [initialAmount, setInitialAmount] = useState<string>('');
  const [monthlyDeposit, setMonthlyDeposit] = useState<string>('');
  const [annualInterestRate, setAnnualInterestRate] = useState<string>('');
  const [years, setYears] = useState<string>('');
  const [includeManagementFees, setIncludeManagementFees] = useState(false);
  const [depositFeeRate, setDepositFeeRate] = useState<string>('');
  const [accumulationFeeRate, setAccumulationFeeRate] = useState<string>('');
  
  // State for calculation results
  const [totalDeposit, setTotalDeposit] = useState<number | null>(null);
  const [interestProfit, setInterestProfit] = useState<number | null>(null);
  const [futureValue, setFutureValue] = useState<number | null>(null);
  const [depositFees, setDepositFees] = useState<number | null>(null);
  const [accumulationFees, setAccumulationFees] = useState<number | null>(null);
  const [lostProfitDueToFees, setLostProfitDueToFees] = useState<number | null>(null);
  const [futureValueWithoutFees, setFutureValueWithoutFees] = useState<number | null>(null);
  const [yearlyResults, setYearlyResults] = useState<Array<{year: number, totalDeposit: number, balance: number, profit: number, profitPercent: number}>>([]);

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

  // Handle blur event to format input value
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '') return;
    
    const formattedValue = formatInputValue(value);
    
    switch (name) {
      case 'initialAmount':
        setInitialAmount(formattedValue);
        break;
      case 'monthlyDeposit':
        setMonthlyDeposit(formattedValue);
        break;
      case 'annualInterestRate':
        setAnnualInterestRate(formattedValue);
        break;
      case 'years':
        setYears(formattedValue);
        break;
      case 'depositFeeRate':
        setDepositFeeRate(formattedValue);
        break;
      case 'accumulationFeeRate':
        setAccumulationFeeRate(formattedValue);
        break;
    }
  };

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Allow only numbers and dots
    const sanitizedValue = value.replace(/[^\d.]/g, '');
    
    switch (name) {
      case 'initialAmount':
        setInitialAmount(sanitizedValue);
        break;
      case 'monthlyDeposit':
        setMonthlyDeposit(sanitizedValue);
        break;
      case 'annualInterestRate':
        setAnnualInterestRate(sanitizedValue);
        break;
      case 'years':
        setYears(sanitizedValue);
        break;
      case 'depositFeeRate':
        setDepositFeeRate(sanitizedValue);
        break;
      case 'accumulationFeeRate':
        setAccumulationFeeRate(sanitizedValue);
        break;
    }
  };

  // Handle calculation
  const calculateCompoundInterest = () => {
    if (!initialAmount || !monthlyDeposit || !annualInterestRate || !years) {
      return;
    }

    const initial = parseFormattedValue(initialAmount);
    const monthly = parseFormattedValue(monthlyDeposit);
    const annualRate = parseFormattedValue(annualInterestRate) / 100;
    const totalYears = parseFormattedValue(years);
    const totalMonths = totalYears * 12;
    
    let depositFeeRateValue = 0;
    let accumulationFeeRateValue = 0;
    
    if (includeManagementFees) {
      depositFeeRateValue = parseFormattedValue(depositFeeRate) / 100;
      accumulationFeeRateValue = parseFormattedValue(accumulationFeeRate) / 100;
    }

    // Calculate without fees using standard compound interest formula
    // For initial deposit: A = P(1+r/n)^nt
    const futureValueInitialWithoutFees = initial * Math.pow(1 + annualRate/12, totalMonths);
    
    // For monthly contributions: PMT * (((1 + r/n)^nt - 1) / (r/n))
    // This is the formula for future value of periodic payments
    const futureValueMonthlyWithoutFees = monthly * ((Math.pow(1 + annualRate/12, totalMonths) - 1) / (annualRate/12));
    
    const totalFutureValueWithoutFees = futureValueInitialWithoutFees + futureValueMonthlyWithoutFees;
    
    // Now calculate with fees
    let balance = initial;
    let totalDepositValue = initial;
    let totalDepositFees = 0;
    let totalAccumulationFees = 0;
    const yearlyData = [];
    
    // For tracking annual data
    let currentYear = 1;
    let monthsProcessed = 0;
    let annualStartBalance = initial;
    let annualDeposits = initial;
    
    for (let i = 0; i < totalMonths; i++) {
      monthsProcessed++;
      
      // Calculate deposit fee
      const depositFee = monthly * depositFeeRateValue;
      totalDepositFees += depositFee;
      
      // Add monthly deposit after fee
      const effectiveDeposit = monthly - depositFee;
      balance += effectiveDeposit;
      totalDepositValue += monthly;
      
      // Add monthly interest
      const monthlyInterest = balance * (annualRate / 12);
      balance += monthlyInterest;
      
      // Calculate accumulation fee (annual rate applied monthly)
      const monthlyAccumulationFee = balance * (accumulationFeeRateValue / 12);
      balance -= monthlyAccumulationFee;
      totalAccumulationFees += monthlyAccumulationFee;
      
      // Record yearly results
      if (monthsProcessed === 12 || i === totalMonths - 1) {
        const yearlyDeposit = i < 12 ? initial + (monthly * (monthsProcessed)) : monthly * 12;
        const yearProfit = balance - annualStartBalance - (monthly * monthsProcessed) + totalDepositFees;
        const yearProfitPercent = (yearProfit / annualStartBalance) * 100;
        
        yearlyData.push({
          year: currentYear,
          totalDeposit: Math.round(annualDeposits),
          balance: Math.round(balance),
          profit: Math.round(yearProfit),
          profitPercent: Math.round(yearProfitPercent * 100) / 100
        });
        
        currentYear++;
        monthsProcessed = 0;
        annualStartBalance = balance;
        annualDeposits = i === totalMonths - 1 ? totalDepositValue : annualDeposits + (monthly * 12);
      }
    }

    // Calculate lost profit due to fees
    const lostProfitDueToFees = totalFutureValueWithoutFees - balance;

    // Set results
    setTotalDeposit(Math.round(totalDepositValue));
    setFutureValue(Math.round(balance));
    setFutureValueWithoutFees(Math.round(totalFutureValueWithoutFees));
    setInterestProfit(Math.round(balance - totalDepositValue));
    setDepositFees(Math.round(totalDepositFees));
    setAccumulationFees(Math.round(totalAccumulationFees));
    setLostProfitDueToFees(Math.round(lostProfitDueToFees));
    setYearlyResults(yearlyData);
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
    setLostProfitDueToFees(null);
    setFutureValueWithoutFees(null);
    setYearlyResults([]);
  };

  return (
    <>
      {/* Header Banner */}
      <div className="bg-[#002F42] py-6 mb-8">
        <MaxWidthWrapper>
          <h1 className="text-white text-center text-5xl md:text-6xl font-bold mb-2">
            חישוב ריבית <span className="font-semibold">דריבית</span>
          </h1>
          <p className="text-white text-center text-lg max-w-3xl mx-auto opacity-90 mt-2">
            אלברט איינשטיין אמר: "ריבית דריבית היא הפלא השמיני בתבל. מי שמבין זאת, מרוויח. מי שלא – משלם."
          </p>
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
                name="initialAmount"
                type="text"
                value={initialAmount}
                onChange={handleChange}
                onBlur={handleBlur}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                dir="rtl"
                placeholder="הזן סכום ראשוני"
              />
              <p className="text-gray-500 text-sm mt-1">הסכום הראשוני שיופקד</p>
            </div>

            <div className="flex flex-col">
              <label htmlFor="monthlyDeposit" className="mb-2 font-medium text-[#002F42]">
                סכום הפקדה חודשי:
              </label>
              <input
                id="monthlyDeposit"
                name="monthlyDeposit"
                type="text"
                value={monthlyDeposit}
                onChange={handleChange}
                onBlur={handleBlur}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                dir="rtl"
                placeholder="הזן סכום חודשי"
              />
              <p className="text-gray-500 text-sm mt-1">הסכום שיופקד בכל חודש</p>
            </div>

            <div className="flex flex-col">
              <label htmlFor="interestRate" className="mb-2 font-medium text-[#002F42]">
                ריבית שנתית (באחוזים):
              </label>
              <div className="relative">
                <input
                  id="interestRate"
                  name="annualInterestRate"
                  type="text"
                  value={annualInterestRate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                  dir="rtl"
                  placeholder="הזן אחוז ריבית"
                />
                {annualInterestRate && (
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">%</span>
                )}
              </div>
              <p className="text-gray-500 text-sm mt-1">הריבית שתתווסף לסכום בכל שנה (באחוזים)</p>
            </div>

            <div className="flex flex-col">
              <label htmlFor="years" className="mb-2 font-medium text-[#002F42]">
                מספר שנות הפקדה:
              </label>
              <input
                id="years"
                name="years"
                type="text"
                value={years}
                onChange={handleChange}
                onBlur={handleBlur}
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                dir="rtl"
                placeholder="הזן מספר שנים"
              />
              <p className="text-gray-500 text-sm mt-1">מספר השנים שבהן יתבצעו הפקדות חודשיות</p>
            </div>

            {/* Management Fees Toggle */}
            <div className="md:col-span-2 mt-2 flex justify-start">
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
                  <div className="relative">
                    <input
                      id="depositFee"
                      name="depositFeeRate"
                      type="text"
                      value={depositFeeRate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                      dir="rtl"
                      placeholder="הזן אחוז דמי ניהול מהפקדה"
                    />
                    {depositFeeRate && (
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">%</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mt-1">אחוז דמי הניהול שירדו מכל הפקדה</p>
                </div>

                <div className="flex flex-col">
                  <label htmlFor="accumulationFee" className="mb-2 font-medium text-[#002F42]">
                    דמי ניהול מהצבירה (באחוזים):
                  </label>
                  <div className="relative">
                    <input
                      id="accumulationFee"
                      name="accumulationFeeRate"
                      type="text"
                      value={accumulationFeeRate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                      dir="rtl"
                      placeholder="הזן אחוז דמי ניהול מהצבירה"
                    />
                    {accumulationFeeRate && (
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600">%</span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm mt-1">אחוז דמי הניהול שירדו בכל שנה מהסכום שנצבר</p>
                </div>
              </>
            )}

            {/* Submit & Reset Buttons */}
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
                className="bg-gray-200 text-gray-800 py-3 px-8 rounded-lg text-xl font-medium hover:bg-gray-300 transition-colors"
              >
                איפוס
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" dir="rtl">
              <div className="flex flex-col bg-gray-50 p-4 rounded-lg">
                <span className="text-gray-600 mb-1">סכום ההפקדה הכולל:</span>
                <span className="text-2xl font-bold text-[#002F42]">{formatNumber(totalDeposit)} ₪</span>
              </div>
              
              <div className="flex flex-col bg-gray-50 p-4 rounded-lg">
                <span className="text-gray-600 mb-1">רווח מהריבית דריבית:</span>
                <span className="text-2xl font-bold text-green-600">{formatNumber(interestProfit)} ₪</span>
              </div>
              
              <div className="flex flex-col bg-gray-50 p-4 rounded-lg">
                <span className="text-gray-600 mb-1">סכום החיסכון העתידי:</span>
                <span className="text-2xl font-bold text-[#32a191]">{formatNumber(futureValue)} ₪</span>
              </div>
              
              {includeManagementFees && (
                <>
                  <div className="flex flex-col bg-gray-50 p-4 rounded-lg">
                    <span className="text-gray-600 mb-1">דמי ניהול מהפקדה:</span>
                    <span className="text-2xl font-bold text-red-500">{formatNumber(depositFees)} ₪</span>
                  </div>
                  
                  <div className="flex flex-col bg-gray-50 p-4 rounded-lg">
                    <span className="text-gray-600 mb-1">דמי ניהול מצבירה:</span>
                    <span className="text-2xl font-bold text-red-500">{formatNumber(accumulationFees)} ₪</span>
                  </div>
                  
                  <div className="flex flex-col bg-gray-50 p-4 rounded-lg">
                    <span className="text-gray-600 mb-1">אובדן רווח עקב גביית דמי ניהול:</span>
                    <span className="text-2xl font-bold text-orange-500">{formatNumber(lostProfitDueToFees)} ₪</span>
                  </div>
                  
                  <div className="flex flex-col bg-gray-50 p-4 rounded-lg md:col-span-2 lg:col-span-3">
                    <span className="text-gray-600 mb-1">סכום חיסכון עתידי ללא דמי ניהול:</span>
                    <span className="text-2xl font-bold text-blue-600">{formatNumber(futureValueWithoutFees)} ₪</span>
                  </div>
                </>
              )}
            </div>
            
            {/* Yearly Results Table */}
            <div className="mt-10" dir="rtl">
              <h3 className="text-xl font-bold text-[#002F42] mb-4">טבלת חישוב שנתית:</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2 text-right">שנה</th>
                      <th className="border p-2 text-right">הכסף המושקע</th>
                      <th className="border p-2 text-right">ערך עתידי</th>
                      <th className="border p-2 text-right">סכום רווח</th>
                      <th className="border p-2 text-right">אחוז רווח</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearlyResults.map((row) => (
                      <tr key={row.year} className="hover:bg-gray-50">
                        <td className="border p-2">{row.year}</td>
                        <td className="border p-2">{formatNumber(row.totalDeposit)} ₪</td>
                        <td className="border p-2">{formatNumber(row.balance)} ₪</td>
                        <td className="border p-2">{formatNumber(row.profit)} ₪</td>
                        <td className="border p-2">{row.profitPercent}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {/* Explanation Section */}
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8" dir="rtl">
          <h2 className="text-2xl font-bold text-[#002F42] mb-4">מהי ריבית דריבית?</h2>
          <p className="text-gray-700 mb-4">
            ריבית דריבית היא תהליך שבו הריבית מתווספת לקרן, ולאחר מכן הריבית המצטברת מחושבת על הסכום החדש.
            זה אחד העקרונות החשובים ביותר בהשקעות לטווח ארוך, מכיוון שהוא מאפשר לכסף שלך לצמוח באופן מעריכי עם הזמן.
          </p>
          <p className="text-gray-700 mb-4">
            לדוגמה: אם תפקידו מדי חודש 1,500 ש"ח בלבד, שיניבו רווח שנתי ממוצע של כ-9%, כעבור 30 שנה, יהיו ברשותכם מעל לשנים וחצי מיליון ש"ח!
          </p>
          <p className="text-gray-700">
            ככל שתתחילו להשקיע מוקדם יותר, תוכלו להרוויח יותר מעוצמת הריבית דריבית, כך שהקרן שלכם תגדל לאורך זמן בצורה משמעותית הרבה יותר.
          </p>
        </div>
      </MaxWidthWrapper>
    </>
  );
} 
"use client";

import { useState } from "react";
import Loader from "@/components/Loader";

// Make.com webhook URL
const WEBHOOK_URL = "https://hook.eu1.make.com/g6x3eo5vakusrt2i1ygtn17445l2xqal";

interface ContactFormProps {
  title?: string;
  subtitle?: string;
  source?: string;
  buttonText?: string;
  showEmailField?: boolean;
  showPhoneField?: boolean;
  showMessageField?: boolean;
  className?: string;
  inline?: boolean;
  tealBackground?: boolean; // For teal background design like in the screenshot
}

export default function ContactForm({
  title = "השאירו פרטים ונחזור אליכם",
  subtitle = "",
  source = "contact_form",
  buttonText = "שליחה",
  showEmailField = false,
  showPhoneField = true,
  showMessageField = false,
  className = "",
  inline = true,
  tealBackground = false,
}: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Send form data to the webhook
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source,
          timestamp: new Date().toISOString(),
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setError("אירעה שגיאה בשליחת הטופס. אנא נסה שוב מאוחר יותר.");
    } finally {
      setIsLoading(false);
    }
  };

  // Define container class based on whether teal background is enabled
  const containerClass = tealBackground 
    ? `w-full ${className}` 
    : `bg-white rounded-lg shadow-lg p-6 ${className}`;

  // Define input class based on whether teal background is enabled
  const inputClass = tealBackground
    ? "flex-1 p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#002F42]"
    : "flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#32a191]";

  // Define button class based on whether teal background is enabled
  const buttonClass = tealBackground
    ? "text-white bg-[#002F42] p-3 rounded-lg font-medium w-full sm:w-auto sm:px-8 hover:bg-[#003a54] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
    : "bg-[#002F42] text-white font-medium py-3 px-6 rounded-lg hover:bg-[#32a191] transition-colors disabled:opacity-70 disabled:cursor-not-allowed";

  return (
    <div className={containerClass}>
      {title && (
        <h2 className={`${tealBackground ? "text-center text-3xl sm:text-4xl md:text-5xl mb-6 sm:mb-10" : "text-3xl font-bold text-[#002F42] mb-4 text-center"}`}>
          {title}
        </h2>
      )}
      
      {subtitle && (
        <p className="text-gray-600 mb-6 text-center">{subtitle}</p>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 text-center">
          <p>{error}</p>
        </div>
      )}
      
      {isSubmitted ? (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-center">
          <p className="text-xl font-semibold">פרטיך נשלחו בהצלחה!</p>
          <p className="mt-2">אנו ניצור איתך קשר בהקדם.</p>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="mt-4 bg-[#002F42] text-white font-medium py-2 px-6 rounded-lg hover:bg-[#32a191] transition-colors"
          >
            שליחת טופס נוסף
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {!showMessageField && inline ? (
            // Inline form layout for simple forms (no message field)
            <div className={`flex flex-col sm:flex-row gap-4 ${tealBackground ? 'max-w-4xl mx-auto' : ''}`}>
              <input
                type="text"
                name="name"
                placeholder="שם מלא"
                value={formData.name}
                onChange={handleChange}
                required
                dir="rtl"
                className={inputClass}
                disabled={isLoading}
              />
              {showEmailField && (
                <input
                  type="email"
                  name="email"
                  placeholder="דוא״ל"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  dir="rtl"
                  className={inputClass}
                  disabled={isLoading}
                />
              )}
              {showPhoneField && (
                <input
                  type="tel"
                  name="phone"
                  placeholder="טלפון"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  dir="rtl"
                  className={inputClass}
                  disabled={isLoading}
                />
              )}
              <button 
                type="submit"
                disabled={isLoading}
                className={buttonClass}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loader size="small" type="spinner" text={null} className="ml-2" />
                    שולח...
                  </div>
                ) : (
                  buttonText
                )}
              </button>
            </div>
          ) : (
            // Stack form layout for forms with message field or when inline is false
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="שם מלא"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  dir="rtl"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                  disabled={isLoading}
                />
              </div>
              {showEmailField && (
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="דוא״ל"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    dir="rtl"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                    disabled={isLoading}
                  />
                </div>
              )}
              {showPhoneField && (
                <div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="טלפון"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    dir="rtl"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                    disabled={isLoading}
                  />
                </div>
              )}
              {showMessageField && (
                <div>
                  <textarea
                    name="message"
                    placeholder="הודעה"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    dir="rtl"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#32a191]"
                    disabled={isLoading}
                  ></textarea>
                </div>
              )}
              <div className="text-center">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#002F42] text-white font-medium py-3 px-8 rounded-lg hover:bg-[#32a191] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader size="small" type="spinner" text={null} className="ml-2" />
                      שולח...
                    </div>
                  ) : (
                    buttonText
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </div>
  );
} 
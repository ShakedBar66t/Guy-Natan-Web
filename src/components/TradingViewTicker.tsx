// TradingViewTicker.tsx
"use client";
import Script from "next/script";
import { useEffect, useState } from "react";

export default function TradingViewTicker() {
  // Use state to track if we should render on client
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    // Check if we're on a mobile device
    const isMobile = window.innerWidth < 768;
    
    // Only set to render if we're on a desktop
    setShouldRender(!isMobile);
    
    // Don't continue with setup if on mobile
    if (isMobile) return;

    // Ensure the widget is positioned at the top after it loads
    const adjustWidget = () => {
      const widgetIframe = document.getElementById("tradingview-widget-ticker-tape");
      if (widgetIframe) {
        const parentElement = widgetIframe.parentElement;
        if (parentElement) {
          parentElement.style.position = "fixed";
          parentElement.style.top = "0";
          parentElement.style.left = "0";
          parentElement.style.width = "100%";
          parentElement.style.zIndex = "50"; // Lower z-index so it doesn't block the header
          
          // IMPORTANT: Modify these lines to force body scrolling
          document.documentElement.style.overflow = "auto";
          document.body.style.overflow = "auto";
          document.body.style.height = "auto";
          document.body.style.position = "static";
        }
      }
    };

    // Run once on component mount
    adjustWidget();
    
    // Also run after a delay to ensure the widget has loaded
    const timeoutId = setTimeout(adjustWidget, 1000);
    
    // Handle resize events
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setShouldRender(false);
      } else {
        setShouldRender(true);
        // Re-adjust the widget when going from mobile to desktop
        setTimeout(adjustWidget, 100);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // If we shouldn't render, return null (nothing)
  if (!shouldRender) {
    return null;
  }

  // Only render the component if shouldRender is true
  return (
    <div className="hidden md:block"> {/* Additional CSS hiding for safety */}
      <div className="tradingview-widget-container__widget"></div>
      <div className="tradingview-widget-copyright"></div>
      <Script
        id="tradingview-widget-ticker-tape"
        strategy="afterInteractive"
        src="https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js"
        dangerouslySetInnerHTML={{
          __html: `
          {
            "symbols": [
              { "description": "USD/ILS", "proName": "FOREXCOM:USDILS" },
              { "description": "Tel Aviv 125", "proName": "TASE:TA125" },
              { "description": "Tel Aviv 35", "proName": "TASE:TA35" },
              { "description": "EUR/ILS", "proName": "SAXO:EURILS" },
              { "description": "NASDAQ 100", "proName": "NASDAQ:NDX" },
              { "description": "NIKKEI", "proName": "OSE:NK2251!" },
              { "description": "Bitcoin", "proName": "BITSTAMP:BTCUSD" },
              { "description": "Ethereum", "proName": "COINBASE:ETHUSD" },
              { "description": "S&P 500 Index", "proName": "FOREXCOM:SPX500" }
            ],
            "showSymbolLogo": true,
            "isTransparent": false,
            "displayMode": "adaptive",
            "colorTheme": "dark",
            "locale": "en"
          }
          `,
        }}
      />
    </div>
  );
}
